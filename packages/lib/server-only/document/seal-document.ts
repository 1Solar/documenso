'use server';

import { nanoid } from 'nanoid';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';

import PostHogServerClient from '@documenso/lib/server-only/feature-flags/get-post-hog-server-client';
import { DOCUMENT_AUDIT_LOG_TYPE } from '@documenso/lib/types/document-audit-logs';
import { createDocumentAuditLogData } from '@documenso/lib/utils/document-audit-logs';
import { prisma } from '@documenso/prisma';
import { DocumentStatus, RecipientRole, SigningStatus } from '@documenso/prisma/client';
import { WebhookTriggerEvents } from '@documenso/prisma/client';
import { signPdf } from '@documenso/signing';

import type { RequestMetadata } from '../../universal/extract-request-metadata';
import { triggerWebhook } from '../../universal/trigger-webhook';
import { getFile } from '../../universal/upload/get-file';
import { putFile } from '../../universal/upload/put-file';
import { insertFieldInPDF } from '../pdf/insert-field-in-pdf';
import { sendCompletedEmail } from './send-completed-email';

export type SealDocumentOptions = {
  documentId: number;
  sendEmail?: boolean;
  requestMetadata?: RequestMetadata;
};

export const sealDocument = async ({
  documentId,
  sendEmail = true,
  requestMetadata,
}: SealDocumentOptions) => {
  'use server';

  const document = await prisma.document.findFirstOrThrow({
    where: {
      id: documentId,
    },
    include: {
      documentData: true,
      Recipient: true,
    },
  });

  const { documentData } = document;

  if (!documentData) {
    throw new Error(`Document ${document.id} has no document data`);
  }

  if (document.status !== DocumentStatus.COMPLETED) {
    throw new Error(`Document ${document.id} has not been completed`);
  }

  const recipients = await prisma.recipient.findMany({
    where: {
      documentId: document.id,
      role: {
        not: RecipientRole.CC,
      },
    },
  });

  if (recipients.some((recipient) => recipient.signingStatus !== SigningStatus.SIGNED)) {
    throw new Error(`Document ${document.id} has unsigned recipients`);
  }

  const fields = await prisma.field.findMany({
    where: {
      documentId: document.id,
    },
    include: {
      Signature: true,
    },
  });

  if (fields.some((field) => !field.inserted)) {
    throw new Error(`Document ${document.id} has unsigned fields`);
  }

  // !: Need to write the fields onto the document as a hard copy
  const pdfData = await getFile(documentData);

  const doc = await PDFDocument.load(pdfData);

  for (const field of fields) {
    await insertFieldInPDF(doc, field);
  }

  const pdfBytes = await doc.save();

  const pdfBuffer = await signPdf({ pdf: Buffer.from(pdfBytes) });

  const { name, ext } = path.parse(document.title);

  const { data: newData } = await putFile({
    name: `${name}_signed${ext}`,
    type: 'application/pdf',
    arrayBuffer: async () => Promise.resolve(pdfBuffer),
  });

  const postHog = PostHogServerClient();

  if (postHog) {
    postHog.capture({
      distinctId: nanoid(),
      event: 'App: Document Sealed',
      properties: {
        documentId: document.id,
      },
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.documentData.update({
      where: {
        id: documentData.id,
      },
      data: {
        data: newData,
      },
    });

    await tx.documentAuditLog.create({
      data: createDocumentAuditLogData({
        type: DOCUMENT_AUDIT_LOG_TYPE.DOCUMENT_COMPLETED,
        documentId: document.id,
        requestMetadata,
        user: null,
        data: {
          transactionId: nanoid(),
        },
      }),
    });
  });

  if (sendEmail) {
    await sendCompletedEmail({ documentId, requestMetadata });
  }

  await triggerWebhook({
    eventTrigger: WebhookTriggerEvents.DOCUMENT_COMPLETED,
    documentData: document,
  });
};

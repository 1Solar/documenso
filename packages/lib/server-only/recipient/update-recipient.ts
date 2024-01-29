import { prisma } from '@documenso/prisma';

export type UpdateRecipientOptions = {
  documentId: number;
  recipientId: number;
  email?: string;
  name?: string;
};

export const updateRecipient = async ({
  documentId,
  recipientId,
  email,
  name,
}: UpdateRecipientOptions) => {
  const recipient = await prisma.recipient.findFirst({
    where: {
      id: recipientId,
      documentId,
    },
  });

  if (!recipient) {
    throw new Error('Recipient not found');
  }

  const updatedRecipient = await prisma.recipient.update({
    where: {
      id: recipient.id,
    },
    data: {
      email: email?.toLowerCase() ?? recipient.email,
      name: name ?? recipient.name,
    },
  });

  return updatedRecipient;
};

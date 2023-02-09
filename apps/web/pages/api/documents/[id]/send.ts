import {
  defaultHandler,
  defaultResponder,
  getUserFromToken,
} from "@documenso/lib/server";
import prisma from "@documenso/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { sendSigningRequest } from "@documenso/lib/mail";
import { getDocument } from "@documenso/lib/query";
import { Document as PrismaDocument, SendStatus } from "@prisma/client";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);
  const { id: documentId } = req.query;

  if (!user) return;

  if (!documentId) {
    res.status(400).send("Missing parameter documentId.");
    return;
  }

  const document: PrismaDocument = await getDocument(+documentId, req, res);

  if (!document)
    res.status(404).end(`No document with id ${documentId} found.`);

  // todo handle sending to single recipient even though more exist

  const recipients = await prisma.recipient.findMany({
    where: {
      documentId: +documentId,
      sendStatus: SendStatus.NOT_SENT,
    },
  });

  if (!recipients.length) return res.status(200).end("");

  (await recipients).forEach(async (recipient) => {
    await sendSigningRequest(recipient, document, user)
      .then(() => {
        return res.status(200).end();
      })
      .catch((err) => {
        console.log(err);
        return res.status(502).end("Coud not send request for signing.");
      });
  });

  // return res.status(500).end();
  // todo check if recipient has an account and show them in their inbox or something
}

export default defaultHandler({
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});

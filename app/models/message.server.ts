import type { Message } from "@prisma/client";

import { prisma } from "~/db.server";

export function sendMessage({
  body,
  chatId,
  sentByName,
}: Pick<Message, "body" | "chatId" | "sentByName">) {
  return prisma.message.create({
    data: {
      body,
      chatId,
      sentByName,
    },
  });
}

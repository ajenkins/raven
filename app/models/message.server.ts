import type { Message } from "@prisma/client";

import { prisma } from "~/db.server";

export function sendMessage({
  body,
  chatId,
}: Pick<Message, "body" | "chatId">) {
  return prisma.message.create({
    data: {
      body,
      chatId,
    },
  });
}

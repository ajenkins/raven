import type { Message } from "@prisma/client";

import { prisma } from "~/db.server";

// export function getMessagesForChat({ id }: Pick<Chat, "id">) {
//   return prisma.chat.findFirst({
//     where: { id },
//     include: {
//       messages: {
//         select: {
//           id: true,
//           body: true,
//           sentAt: true,
//         },
//         orderBy: { sentAt: "asc" },
//       },
//     },
//   });
// }

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

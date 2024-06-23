import type { Chat } from "@prisma/client";

import { prisma } from "~/db.server";

export function getChat({ id }: Pick<Chat, "id">) {
  return prisma.chat.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export function createChat({ name }: Pick<Chat, "name">) {
  return prisma.chat.create({
    data: {
      name,
    },
  });
}

export function deleteChat({ id }: Pick<Chat, "id">) {
  return prisma.chat.delete({
    where: { id },
  });
}

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import invariant from "tiny-invariant";

import EditUsername from "~/components/EditUsername";
import MessageInput from "~/components/MessageInput";
import MyMessage from "~/components/MyMessage";
import OtherMessage from "~/components/OtherMessage";
import { userSettings } from "~/cookies.server";
import { emitter } from "~/emitter.server";
import { getChat } from "~/models/chat.server";
import { sendMessage } from "~/models/message.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userSettings.parse(cookieHeader)) || {};

  invariant(params.chatId, "chatId not found");
  const chat = await getChat({ id: params.chatId });
  if (!chat) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ chat, username: cookie.username });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userSettings.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "message": {
      const body = formData.get("message");

      if (typeof body !== "string") {
        return json(
          { errors: { body: null, title: "Message must be a string" } },
          { status: 400 },
        );
      }

      if (body.length === 0) {
        return json(
          { errors: { body: null, title: "Message cannot be empty" } },
          { status: 400 },
        );
      }

      invariant(params.chatId, "chatId not found");
      const message = await sendMessage({
        body,
        chatId: params.chatId,
        sentByName: cookie.username,
      });
      emitter.emit("message", JSON.stringify(message));

      return json({ message }, { status: 201 });
    }
    case "username": {
      const username = formData.get("username");
      cookie.username = username;

      return redirect(request.url, {
        headers: {
          "Set-Cookie": await userSettings.serialize(cookie),
        },
      });
    }
    case "resetUsername": {
      cookie.username = "";

      return redirect(request.url, {
        headers: {
          "Set-Cookie": await userSettings.serialize(cookie),
        },
      });
    }
  }
};

export default function ChatPage() {
  const { chat, username } = useLoaderData<typeof loader>();
  const newMessage = useEventSource("/chat/subscribe", {
    event: "message",
  });
  const [allMessages, setAllMessages] = useState(chat.messages);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  // Add new messages received from SSE to allMessages
  useEffect(() => {
    if (newMessage) {
      const parsedNewMessage = JSON.parse(newMessage);
      setAllMessages((prev) => [...prev, parsedNewMessage]);
    }
  }, [newMessage]);

  // Auto-scroll to the last message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 bg-white border-b border-gray-300">
        <h1 className="text-xl font-bold">{chat.name}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {allMessages.map((message) => {
          if (message.sentByName === username) {
            return <MyMessage key={message.id} message={message} />;
          } else {
            return <OtherMessage key={message.id} message={message} />;
          }
        })}
        <div ref={endOfMessagesRef}></div>
      </div>
      <div className="flex-none p-4 bg-white border-t border-gray-300">
        {username ? <MessageInput /> : <EditUsername />}
      </div>
    </div>
  );
}

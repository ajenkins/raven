import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import invariant from "tiny-invariant";

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
  const form = formData.get("form");
  switch (form) {
    case "message": {
      const body = formData.get("message");

      if (typeof body !== "string") {
        return json(
          { errors: { body: null, title: "Message must be a string" } },
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

      return json(null, { status: 201 });
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
  }
};

export default function ChatPage() {
  const { chat, username } = useLoaderData<typeof loader>();
  const newMessage = useEventSource("/chat/subscribe", {
    event: "message",
  });
  const [allMessages, setAllMessages] = useState(chat.messages);
  const navigation = useNavigation();
  const isSending = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (newMessage) {
      const parsedNewMessage = JSON.parse(newMessage);
      setAllMessages((prev) => [...prev, parsedNewMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    if (!isSending) {
      formRef.current?.reset();
    }
  }, [isSending]);

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 w-full p-4 bg-white border-b border-gray-300 box-border">
        <h1 className="text-xl font-bold">{chat.name}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
        {allMessages.map((message) =>
          message.sentByName === username ? (
            // Sent by me
            <div key={message.id} className="mb-4 flex justify-end">
              <div className="max-w-xs text-left">
                <div className="text-sm text-gray-600">{username}</div>
                <div className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  <p>{message.body}</p>
                </div>
              </div>
            </div>
          ) : (
            // Sent by someone else
            <div key={message.id} className="mb-4 flex justify-start">
              <div className="max-w-xs text-left">
                <div className="text-sm text-gray-600">
                  {message.sentByName}
                </div>
                <div className="bg-gray-200 py-2 px-4 rounded-lg">
                  <p>{message.body}</p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      {username ? (
        <Form method="post" ref={formRef}>
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-300 box-border">
            <div className="flex items-center">
              <input
                name="message"
                placeholder="Type something..."
                className="border-black border-2 p-2 flex-1"
              />
              <button
                type="submit"
                name="form"
                value="message"
                className="flex items-center justify-center rounded-md ml-2 bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
              >
                Send
              </button>
            </div>
          </div>
        </Form>
      ) : (
        <Form method="put">
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-300 box-border">
            <label htmlFor="message-input" className="block mb-2 font-bold">
              Enter a username:
            </label>
            <div className="flex items-center">
              <input
                name="username"
                type="text"
                id="message-input"
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="Type your name here..."
              />
              <button
                type="submit"
                name="form"
                value="username"
                className="flex items-center justify-center rounded-md ml-2 bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}

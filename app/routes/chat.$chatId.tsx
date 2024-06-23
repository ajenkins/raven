import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import { getChat } from "~/models/chat.server";
import { sendMessage } from "~/models/message.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.chatId, "chatId not found");

  const chat = await getChat({ id: params.chatId });
  if (!chat) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ chat });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.chatId, "chatId not found");
  const formData = await request.formData();
  const body = formData.get("message");

  if (typeof body !== "string") {
    return json(
      { errors: { body: null, title: "Message must be a string" } },
      { status: 400 },
    );
  }

  await sendMessage({ body, chatId: params.chatId });
  return null;
};

export default function ChatPage() {
  const { chat } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSending = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isSending) {
      formRef.current?.reset();
    }
  }, [isSending]);

  return (
    <div>
      <h1 className="text-center text-4xl mt-4 mb-8 font-extrabold tracking-tight">
        {chat.name}
      </h1>
      {chat.messages.map((message) => (
        <p key={message.id}>{message.body}</p>
      ))}
      <Form method="post" ref={formRef}>
        <div className="flex fixed items-center bottom-0 w-full p-4">
          <input
            name="message"
            placeholder="Type something..."
            className="border-black border-2 p-2 flex-1"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-md ml-2 bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
          >
            Send
          </button>
        </div>
      </Form>
    </div>
  );
}

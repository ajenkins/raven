import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getChat } from "~/models/chat.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.chatId, "chatId not found");

  const chat = await getChat({ id: params.chatId });
  if (!chat) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ chat });
};

export default function ChatPage() {
  const { chat } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-center text-4xl mt-4 mb-8 font-extrabold tracking-tight">
        {chat.name}
      </h1>
      <Form action="post">
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

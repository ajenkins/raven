import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createChat } from "~/models/chat.server";

export const meta: MetaFunction = () => [{ title: "Raven" }];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("title");

  if (typeof name !== "string") {
    return json(
      { errors: { body: null, title: "Name must be a string" } },
      { status: 400 },
    );
  }

  const chat = await createChat({ name });

  return redirect(`/chat/${chat.id}`);
};

export default function Index() {
  return (
    <main className="relative min-h-screen bg-gray-200 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pb-8 pt-4 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pb-20 lg:pt-12">
              <div className="flex justify-center">
                <img
                  src="/images/raven-color.svg"
                  alt="A cartoon raven wearing rave sunglasses"
                  className="w-1/2"
                />
              </div>
              <h1 className="text-center text-6xl mb-8 font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-violet-600 drop-shadow-md">
                  Raven
                </span>
              </h1>
              <Form method="post">
                <div className="flex space-y-4 justify-center items-center flex-col">
                  <label>
                    <div>Chat Title</div>
                    <input
                      name="title"
                      placeholder="Optional"
                      autoComplete="off"
                      className="border-black border-2 p-2"
                    />
                  </label>
                  <div className="space-y-4 sm:mx-auto">
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-md bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-700"
                    >
                      Start A New Chat
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

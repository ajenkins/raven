import { Form } from "@remix-run/react";

interface MessageInputProps {
  formRef: React.RefObject<HTMLFormElement>;
}

export default function MessageInput({ formRef }: MessageInputProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-300 box-border">
      <Form method="delete">
        <button
          type="submit"
          name="intent"
          value="resetUsername"
          className="block mb-2 font-bold text-blue-600 hover:underline"
        >
          Edit Name
        </button>
      </Form>
      <Form method="post" ref={formRef}>
        <div className="flex items-center">
          <input
            name="message"
            placeholder="Type something..."
            className="border-black border-2 p-2 flex-1"
          />
          <button
            type="submit"
            name="intent"
            value="message"
            className="flex items-center justify-center rounded-md ml-2 bg-green-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
          >
            Send
          </button>
        </div>
      </Form>
    </div>
  );
}

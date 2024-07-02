import { useFetcher } from "@remix-run/react";
import { useRef, useEffect } from "react";

export default function MessageInput() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitted = fetcher.state === "idle" && fetcher.data;

  useEffect(() => {
    if (isSubmitted) {
      formRef.current?.reset();
    }
  }, [isSubmitted]);

  return (
    <div className="flex-none p-4 bg-white border-t border-gray-300">
      <fetcher.Form method="delete">
        <button
          type="submit"
          name="intent"
          value="resetUsername"
          className="block mb-2 font-bold text-blue-600 hover:underline"
        >
          Edit Name
        </button>
      </fetcher.Form>
      <fetcher.Form method="post" ref={formRef}>
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
            className="flex items-center justify-center rounded-md ml-2 bg-green-500 px-4 py-3 font-medium text-white hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

import { useFetcher } from "@remix-run/react";

export default function EditUsername() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="put">
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
            name="intent"
            value="username"
            className="flex items-center justify-center rounded-md ml-2 bg-green-500 px-4 py-3 font-medium text-white hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </fetcher.Form>
  );
}

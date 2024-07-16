import { useFetcher } from "@remix-run/react";

export default function EditUsername() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="put">
      <label htmlFor="message-input" className="block mb-2 font-bold">
        Enter a name:
      </label>
      <div className="flex items-center">
        <input
          name="name"
          type="text"
          id="message-input"
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Type your name here..."
          autoComplete="name"
        />
        <button
          type="submit"
          name="intent"
          value="username"
          className="flex items-center justify-center rounded-md ml-2 bg-green-500 px-4 py-3 font-medium text-white hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </fetcher.Form>
  );
}

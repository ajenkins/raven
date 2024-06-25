interface MyMessageProps {
  message: {
    id: string;
    body: string;
    sentByName: string | null;
    sentAt: string;
  };
}

export default function MyMessage({ message }: MyMessageProps) {
  const dateStr = new Date(message.sentAt).toLocaleString();

  return (
    <div className="mb-4 flex justify-end">
      <div className="max-w-xs md:max-w-md lg:max-w-xl">
        <div className="text-sm text-gray-600 pb-1">{message.sentByName}</div>
        <div className="bg-violet-600 text-white py-2 px-4 rounded-lg">
          <p>{message.body}</p>
        </div>
        <div className="text-xs text-gray-600 text-right">{dateStr}</div>
      </div>
    </div>
  );
}

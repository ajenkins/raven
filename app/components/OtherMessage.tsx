interface OtherMessageProps {
  message: {
    id: string;
    body: string;
    sentByName: string | null;
    sentAt: string;
  };
}

export default function OtherMessage({ message }: OtherMessageProps) {
  const dateStr = new Date(message.sentAt).toLocaleString();

  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-xs md:max-w-md lg:max-w-xl">
        <div className="text-sm text-gray-600 pb-1">{message.sentByName}</div>
        <div className="bg-gray-200 py-2 px-4 rounded-lg">
          <p>{message.body}</p>
        </div>
        <div className="text-xs text-gray-600 text-right">{dateStr}</div>
      </div>
    </div>
  );
}

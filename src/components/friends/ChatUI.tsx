export default function ChatUI() {
  return (
    <div className="flex flex-col h-[500px] bg-gray-900 rounded-xl">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-gray-700 p-2 rounded-lg w-fit">
          Hey! Ready to play?
        </div>

        <div className="bg-teal-400 text-black p-2 rounded-lg w-fit ml-auto">
          Yes! Send code 🔥
        </div>
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2 border-t border-gray-700">
        <input
          className="flex-1 bg-gray-800 p-2 rounded-lg outline-none"
          placeholder="Type message..."
        />
        <button className="bg-teal-400 text-black px-4 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { InAppMessage } from "../../components/friends/InAppMsgCard";

export default function InAppMessageContainer() {
  const [messages, setMessages] = useState([]);

  // Simulate incoming messages (replace with socket later)
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();

      setMessages((prev) => [
        {
          id,
          name: "John Doe",
          text: "Yo bro let’s play 🔥",
          avatar: "https://i.pravatar.cc/100?img=3",
        },
        ...prev,
      ]);

      // auto remove after 4s
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 8000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90%] max-w-sm">
      <AnimatePresence>
        {messages.map((msg) => (
          <InAppMessage
            key={msg.id}
            message={msg}
            onClick={() => {
              console.log("Open chat with", msg.name);
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
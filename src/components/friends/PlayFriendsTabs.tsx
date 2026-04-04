import { useState } from "react";
import InviteSearchCard from "./InviteSearchCard";
import ActiveOpenGames from "./ActiveOpenGames";
import ChatUI from "./ChatUI";

export default function PlayFriendsTabs() {
  const [tab, setTab] = useState("game");

  return (
    <>
      {/* Inner Tabs */}
      <div className="flex bg-gray-800 rounded-full p-1 mb-6">
        <button
          onClick={() => setTab("game")}
          className={`flex-1 py-2 rounded-full ${
            tab === "game" ? "bg-teal-400 text-black" : "text-gray-300"
          }`}
        >
          Game
        </button>

        <button
          onClick={() => setTab("chat")}
          className={`flex-1 py-2 rounded-full ${
            tab === "chat" ? "bg-teal-400 text-black" : "text-gray-300"
          }`}
        >
          Chat
        </button>
      </div>

      {tab === "game" ? (
        <>
          <InviteSearchCard />
          <ActiveOpenGames />
        </>
      ) : (
        <ChatUI />
      )}
    </>
  );
}
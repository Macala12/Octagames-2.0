// ─── ChatRoom.tsx ─────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  type?: "text" | "game-challenge";
}

const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isMe = msg.sender === "me";

  if (msg.type === "game-challenge") {
    return (
      <div className="flex justify-center my-1">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
          style={{ background: "rgba(9,242,166,0.1)", border: "0.5px solid rgba(9,242,166,0.25)" }}>
          <span className="text-base">🎮</span>
          <span className="text-[12px] font-bold" style={{ color: ACCENT }}>Game challenge sent!</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[72%]">
        <div className="px-4 py-2.5 text-[14px] leading-relaxed"
          style={{
            background:   isMe ? ACCENT : "rgba(255,255,255,0.08)",
            color:        isMe ? ACCENT_TEXT : "#fff",
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            border:       isMe ? "none" : "0.5px solid rgba(255,255,255,0.08)",
            fontWeight:   isMe ? 500 : 400,
          }}>
          {msg.text}
        </div>
        <p className="text-[10px] mt-1 px-1"
          style={{ color: "rgba(255,255,255,0.3)", textAlign: isMe ? "right" : "left" }}>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    { id:1, text:"Yo bro",                   sender:"other", time:"2:28 PM" },
    { id:2, text:"You ready to play?",        sender:"other", time:"2:28 PM" },
    { id:3, text:"Yeah let's go 🔥",          sender:"me",    time:"2:30 PM" },
    { id:4, text:"I'll destroy you this time 😤", sender:"me", time:"2:30 PM" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), text: input.trim(), sender: "me", time: now() }]);
    setInput("");
  };

  const sendGameChallenge = () => {
    setMessages(m => [...m, { id: Date.now(), text: "", sender: "me", time: now(), type: "game-challenge" }]);
  };

  const canSend = input.trim().length > 0;

  return (
    <div className="h-screen flex flex-col" style={{ background: "#04091a" }}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
        <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        <div className="relative flex-shrink-0">
          <img src="https://i.pravatar.cc/100?img=3" alt="Avatar"
            className="w-10 h-10 rounded-full object-cover block"
            style={{ border: `2px solid rgba(9,242,166,0.4)` }} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: ACCENT, borderColor: "#04091a" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-white">John Doe</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, animation: "pulse 2s infinite" }} />
            <p className="text-[11px] font-semibold" style={{ color: ACCENT }}>Online</p>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5"  r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* No active match banner */}
      <div className="mx-3 mt-2.5 px-3.5 py-2.5 rounded-2xl"
        style={{ background: "rgba(251,191,36,0.06)", border: "0.5px solid rgba(251,191,36,0.2)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="text-[12px] font-bold" style={{ color: "#FBBF24" }}>No active match</span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(251,191,36,0.6)" }}>
          Challenge this friend to start a game and earn rewards 🎮
        </p>
      </div>

      {/* Clears notice */}
      <div className="flex items-center justify-center gap-1.5 mx-3 mt-1.5 py-2 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Chats clear every 12 hours
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {/* Date divider */}
        <div className="flex items-center gap-2.5 my-1">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[11px] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)" }}>Today</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3">
        <div className="flex items-center gap-2 rounded-[22px] px-4 py-2"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <input value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder:text-white/25" />

          <button onClick={sendGameChallenge}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            🎮
          </button>

          <button onClick={send}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={{ background: canSend ? ACCENT : "rgba(255,255,255,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={canSend ? ACCENT_TEXT : "rgba(255,255,255,0.3)"} strokeWidth="2.5" strokeLinecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
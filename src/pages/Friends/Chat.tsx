// ─── ChatsScreen.tsx ──────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Chat {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup: boolean;
  avatar: string;
  avatarColor: string;
  initials: string;
}

const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

type Tab = "all" | "unread" | "groups";

const mockChats: Chat[] = [
  { id:1, name:"John Doe",      message:"Bro are you coming online?",   time:"2:30 PM",   unread:2, online:true,  isGroup:false, avatar:"https://i.pravatar.cc/100?img=1", avatarColor:"#7C3AED", initials:"JD" },
  { id:2, name:"Gaming Squad",  message:"We are starting in 5 mins 🔥", time:"1:10 PM",   unread:5, online:true,  isGroup:true,  avatar:"https://i.pravatar.cc/100?img=2", avatarColor:"#0369A1", initials:"GS" },
  { id:3, name:"Tunde Bello",   message:"GG bro that was close 😤",     time:"12:00 PM",  unread:0, online:false, isGroup:false, avatar:"https://i.pravatar.cc/100?img=4", avatarColor:"#065F46", initials:"TB" },
  { id:4, name:"Adaeze Obi",    message:"Rematch when? I'll destroy u", time:"11:45 AM",  unread:0, online:true,  isGroup:false, avatar:"https://i.pravatar.cc/100?img=5", avatarColor:"#9D174D", initials:"AO" },
  { id:5, name:"Dart Masters",  message:"Tournament starts at 9pm!",    time:"Yesterday", unread:0, online:false, isGroup:true,  avatar:"https://i.pravatar.cc/100?img=6", avatarColor:"#B45309", initials:"DM" },
];

function ChatSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/8 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded bg-gray-100 dark:bg-white/8 animate-pulse w-1/3" />
        <div className="h-3 rounded bg-gray-100 dark:bg-white/8 animate-pulse w-2/3" />
      </div>
    </div>
  );
}

function Avatar({ chat, size = 46 }: { chat: Chat; size?: number }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative flex-shrink-0">
      {err ? (
        <div className="rounded-full flex items-center justify-center text-white font-extrabold text-[14px]"
          style={{ width: size, height: size, background: chat.avatarColor }}>
          {chat.initials}
        </div>
      ) : (
        <img src={chat.avatar} alt={chat.name} onError={() => setErr(true)}
          className="rounded-full object-cover block"
          style={{ width: size, height: size,
            border: `1.5px solid ${chat.unread > 0 ? ACCENT : "var(--color-border-tertiary)"}` }} />
      )}
      {chat.online && (
        <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#04091a]"
          style={{ background: ACCENT }} />
      )}
    </div>
  );
}

export function ChatsScreen() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats]     = useState<Chat[]>([]);
  const [tab, setTab]         = useState<Tab>("all");
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => { setChats(mockChats); setLoading(false); }, 1200);
  }, []);

  const filtered = chats.filter(c => {
    if (tab === "unread" && c.unread === 0)  return false;
    if (tab === "groups" && !c.isGroup)      return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { id: Tab; label: string }[] = [
    { id: "all",    label: "All"     },
    { id: "unread", label: "Unread"  },
    { id: "groups", label: "Groups"  },
  ];

  return (
    <div className="h-screen text-gray-900 dark:text-white flex flex-col">

      {/* Header */}
      <div className="px-4 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[22px] font-extrabold">Chats</h1>
          <div className="flex gap-2">
            {[
              <svg key="s" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
              <svg key="m" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>,
            ].map((icon, i) => (
              <button key={i} className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" width="15" height="15"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none
              bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8
              text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-white/8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2.5 text-[13px] font-bold border-b-2 bg-transparent transition-all"
              style={{
                color: tab === t.id ? ACCENT : "var(--color-text-tertiary)",
                borderBottomColor: tab === t.id ? ACCENT : "transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <ChatSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-gray-400">No chats found</div>
        ) : (
          filtered.map((chat, i) => (
            <button key={chat.id} onClick={() => navigate("/chat-room")}
              className="w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/8
                transition-colors"
              style={{ animation: `fadeUp 0.3s ease ${i * 60}ms both` }}>
              <Avatar chat={chat} />
              <div className="flex-1 min-w-0 border-b border-gray-100 dark:border-white/[0.05] pb-2.5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-[14px] font-semibold text-gray-900 dark:text-white truncate max-w-[160px]"
                    style={{ fontWeight: chat.unread > 0 ? 700 : 500 }}>
                    {chat.name}
                  </span>
                  <span className="text-[11px] ml-2 flex-shrink-0"
                    style={{ color: chat.unread > 0 ? ACCENT : "var(--color-text-tertiary)" }}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-400 truncate max-w-[180px]">{chat.message}</span>
                  {chat.unread > 0 && (
                    <div className="rounded-full text-[10px] font-extrabold px-1.5 py-0.5 min-w-[20px] flex items-center justify-center ml-2 flex-shrink-0"
                      style={{ background: ACCENT, color: ACCENT_TEXT }}>
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
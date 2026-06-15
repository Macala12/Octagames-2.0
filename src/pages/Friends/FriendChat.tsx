import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NeubrutalistCard from "../../components/ui/cards/NeuCard";
import FriendGameSearch from "./GameSearch";
import OnlineFriends from "../../components/friends/PlatFriendFindFriend";

// --- Types ---
interface ChatPreview {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
}

interface TournamentHistoryItem {
  id: string;
  title: string;
  image?: string;
  reward: number;
  date: string;
  status: "ended" | "active";
  bg: string;
  accent: string;
}

interface ActiveTournament {
  id: string;
  title: string;
  prize: number;
  endTime: string;
  image?: string;
}

interface Props {
  chats?: ChatPreview[];
  tournamentHistory?: TournamentHistoryItem[];
  activeTournament?: ActiveTournament | null;
  onChatClick?: (chat: ChatPreview) => void;
  onJoinGame?: (code: string) => void;
  onCreateGame?: () => void;
  onViewTournament?: (id: string) => void;
}

const ACCENT = "#7C3AED";
const ACCENT_TEXT = "#fff";

// --- Countdown hook ---
function useCountdown(endTime: string) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return setDisplay("Ended");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(`${String(h).padStart(2,"0")}h : ${String(m).padStart(2,"0")}m : ${String(s).padStart(2,"0")}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return display;
}

// --- Tab pill ---
function TabPill({ tabs, active, onChange }: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex dark: text-white p-1 gap-1">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex-1 py-2.5 text-[13px] font-bold transition-all"
          style={active === t.id
            ? { color: '#000', border: `1px solid ${ACCENT},`, background: ACCENT }
            : { background: "transparent", color: "var(--color-text-secondary)" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Message Banner (fixed) ────────────────────────────────────────────────
const MessageBanner = ({ count = 10, onClick }: { count?: number; onClick?: () => void }) => (
  <div onClick={onClick}
    className="relative rounded-[18px] p-4 overflow-hidden flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">

    {/* Icon tile */}
    <div className="relative w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.1)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>

    {/* Text */}
    <div className="relative flex-1 min-w-0">
      <p className="text-[15px] font-extrabold mb-0.5 text-white">Messages</p>
      <p className="text-[12px] text-white">
        You have <span className="font-extrabold" style={{ color: ACCENT }}>{count}</span> new messages
      </p>
    </div>

    {/* Arrow — vertically centered on the right */}
    <div className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(0,0,0,0.1)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  </div>
);

// --- Games tab ---
function GamesTab({ onJoinGame, onCreateGame }: { onJoinGame?: (c: string) => void; onCreateGame?: () => void }) {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5" >
      {/* Hero banner */}
      <OnlineFriends  />
      
      <NeubrutalistCard
        mainColor="#1a1a1a"
        shadowColor="#7C3AED"
        pressable
        shadowOffsetX={5}
        shadowOffsetY={5}
        borderRadius={10}
      >
      <div className="relative rounded-[10px] p-4 overflow-hidden flex items-center gap-3" onClick={() => {navigate('/create')}}>
        <div className="relative w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ background: "#7C3AED", border: "1px solid #7C3AEDae" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={"#000"} strokeWidth="1.8" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div className="relative">
          <p className="text-[15px] font-extrabold text-white mb-1">Play with your friends</p>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Invite friends, compete together, and see who tops the leaderboard.
          </p>
        </div>
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#7C3AED" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
      </NeubrutalistCard>

      {/* Game code input */}
      <FriendGameSearch onJoinGame={onJoinGame} onCreateGame={onCreateGame} />

      {/* <div>
        <p className="text-[14px] font-extrabold text-gray-900 dark:text-white mb-1">Search for a friends game</p>
        <p className="text-[12px] text-gray-400 mb-3">Enter a game code to join a private game created by your friend.</p>
        <div className="relative">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && code.length >= 4 && onJoinGame?.(code)}
            placeholder="Type game code..."
            maxLength={8}
            className="w-full px-4 pr-11 py-3.5 text-[14px] font-semibold tracking-widest outline-none transition-all
              bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8
              text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20
              focus:border-[#09f2a6]"
          />
          <button onClick={() => code.length >= 4 && onJoinGame?.(code)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: code.length >= 4 ? ACCENT : "var(--color-border-tertiary)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={code.length >= 4 ? ACCENT_TEXT : "var(--color-text-tertiary)"} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div> */}

      {/* Active games empty state */}
      <div>
        <p className="text-[14px] mt-2 font-extrabold text-gray-900 dark:text-white mb-4">Active Open Games</p>
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center
            bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-text-tertiary)" strokeWidth="1.2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-[15px] font-extrabold text-gray-900 dark:text-white mb-1.5">No active games yet</p>
          <p className="text-[12px] text-gray-400 leading-relaxed mb-5">
            Create a game and play with friends.<br />Be the first and invite them to play 🎯
          </p>
          <button onClick={onCreateGame}
            className="px-6 py-2.5 text-[13px] text-black font-extrabold active:scale-95 transition-transform"
            style={{ background: ACCENT }}>
            + Create a Game
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Chats tab ---
// function ChatsTab({ chats = [], onChatClick }: { chats: ChatPreview[]; onChatClick?: (c: ChatPreview) => void }) {
//   const [search, setSearch] = useState("");
//   const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div>
//       <div className="relative mb-4">
//         <input value={search} onChange={e => setSearch(e.target.value)}
//           placeholder="Search messages..."
//           className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none
//             bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8
//             text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20" />
//         <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="15" height="15"
//           viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round">
//           <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//         </svg>
//       </div>

//       {filtered.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">No chats yet</p>
//           <p className="text-[12px] text-gray-400">Challenge a friend to start a conversation</p>
//         </div>
//       ) : (
//         filtered.map(chat => (
//           <button key={chat.id} onClick={() => onChatClick?.(chat)}
//             className="w-full flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/8 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
//             <div className="relative w-[46px] h-[46px] rounded-full flex items-center justify-center flex-shrink-0 text-[15px] font-extrabold text-white"
//               style={{ background: chat.color }}>
//               {chat.initials}
//               {chat.online && (
//                 <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0a0a0a]"
//                   style={{ background: ACCENT }} />
//               )}
//               {chat.unread > 0 && (
//                 <div className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-extrabold border-2 border-white dark:border-[#0a0a0a]"
//                   style={{ background: ACCENT, color: ACCENT_TEXT }}>
//                   {chat.unread}
//                 </div>
//               )}
//             </div>
//             <div className="flex-1 min-w-0 text-left">
//               <div className="flex items-center justify-between mb-0.5">
//                 <span className="text-[14px] font-bold text-gray-900 dark:text-white">{chat.name}</span>
//                 <span className="text-[11px]" style={{ color: chat.unread > 0 ? ACCENT : "var(--color-text-tertiary)" }}>
//                   {chat.time}
//                 </span>
//               </div>
//               <p className="text-[12px] text-gray-400 truncate max-w-[220px]">{chat.lastMessage}</p>
//             </div>
//           </button>
//         ))
//       )}
//     </div>
//   );
// }

// --- Tournament card ---
function ActiveTournamentCard({ tournament, onView }: { tournament: ActiveTournament; onView?: (id: string) => void }) {
  const timer = useCountdown(tournament.endTime);
  return (
    <div className="overflow-hidden" style={{ background: "#0a0a0a"}}>
      <div className="h-24 relative overflow-hidden flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        {tournament.image ? (
          <img src={tournament.image} alt={tournament.title} className="w-full h-full object-cover" />
        ) : (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 96" preserveAspectRatio="xMidYMid slice">
            <defs><pattern id="atd" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.06)"/></pattern></defs>
            <rect width="360" height="96" fill="url(#atd)"/>
            <ellipse cx="300" cy="20" rx="120" ry="80" fill="#09f2a6" opacity="0.07"/>
            <circle cx="300" cy="96" r="90" fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.15"/>
          </svg>
        )}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(9,242,166,0.5)" strokeWidth="1.2" strokeLinecap="round" style={{ position: "relative", zIndex: 1 }}>
          <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2M6 4h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z"/>
        </svg>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-extrabold text-white mb-1">{tournament.title}</p>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Ends in</p>
          <p className="text-[14px] font-extrabold" style={{ color: ACCENT }}>{timer}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Prize Pool</p>
          <p className="text-[18px] font-extrabold text-white mb-2">₦{tournament.prize.toLocaleString()}</p>
          <button onClick={() => onView?.(tournament.id)}
            className="rounded-full px-4 py-1.5 text-[11px] font-extrabold"
            style={{ background: ACCENT, color: ACCENT_TEXT }}>
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

// --- History card ---
function HistoryCard({ item, onView }: { item: TournamentHistoryItem; onView?: (id: string) => void }) {    
    return (
    <>
        {item.title ? (
            <div className="overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
                <div className="h-24 relative overflow-hidden flex items-center justify-center" style={{ background: item.bg }}>
                    {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="1.2" strokeLinecap="round" style={{ opacity: 0.7 }}>
                        <rect x="2" y="6" width="20" height="14" rx="3"/><path d="M8 10v4M6 12h4M14 11h4M14 13h4"/>
                    </svg>
                    )}
                </div>
                <div className="px-4 py-3">
                    <p className="text-[14px] font-extrabold text-gray-900 dark:text-white mb-1">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mb-0.5">
                    Reward: <span className="font-bold text-gray-700 dark:text-white/70">₦{item.reward.toLocaleString()}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mb-3">{item.date}</p>
                    <div className="flex gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40">
                        Ended
                    </span>
                    <button onClick={() => onView?.(item.id)}
                        className="px-3.5 py-1.5 rounded-full text-[11px] font-bold"
                        style={{ background: ACCENT, color: ACCENT_TEXT }}>
                        Open
                    </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="rounded-2xl px-4 py-6 text-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
                <p className="text-[13px] text-gray-400">
                  You have no{" "}
                  <span className="font-bold" style={{ color: ACCENT }}>previous</span>
                  {" "}tournament
                </p>
            </div>
        )}
    </>
  );
}

// --- Main screen ---
export default function FriendsScreen({
  tournamentHistory = [{id: "1", title: "fake title", reward: 100, date: "2025", status: "active", bg: "#fff", accent: "#000"}],
  activeTournament = {id: "1", title: "Subway Surfers", prize: 1000, endTime: "2026-06-12T12:00:00Z", image: "a"},
  onJoinGame,
  onCreateGame,
  onViewTournament,
}: Props) {
  const [mainTab, setMainTab]   = useState("friends");

  return (
    <div className="px-2 pt-5 pb-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">Friends</h1>
          <p className="text-xs text-gray-400 mt-0.5">Challenge, play and have fun with friends</p>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-white/10 border-gray-200 dark:border-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED"
            strokeWidth="2" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </button>
      </div>

      {/* Main tabs */}
      <TabPill
        tabs={[{ id: "friends", label: "Play with Friends" }, { id: "tournament", label: "Active Tournament" }]}
        active={mainTab} onChange={setMainTab}
      />

      {/* Play with Friends */}
      {mainTab === "friends" && (
        <div className="mt-5">
          <GamesTab onJoinGame={onJoinGame} onCreateGame={onCreateGame} />
        </div>
      )}

      {/* Active Tournament */}
      {mainTab === "tournament" && (
        <div className="mt-5 flex flex-col gap-6">

          {/* My Tournament */}
          <div>
            <p className="text-[16px] font-extrabold text-gray-900 dark:text-white mb-1">My Tournament</p>
            <p className="text-[12px] text-gray-400 mb-4">Your ongoing tournaments, all lined up for you.</p>
            {activeTournament ? (
              <ActiveTournamentCard tournament={activeTournament} onView={onViewTournament} />
            ) : (
              <div className="rounded-2xl px-4 py-6 text-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
                <p className="text-[13px] text-gray-400">
                  You have no{" "}
                  <span className="font-bold" style={{ color: ACCENT }}>active / joined</span>
                  {" "}tournament
                </p>
              </div>
            )}
          </div>

          {/* History */}
          <div>
            <p className="text-[16px] font-extrabold text-gray-900 dark:text-white mb-1">Tournament History</p>
            <p className="text-[12px] text-gray-400 mb-4">Check out all your past tournaments here.</p>
            <div className="flex flex-col gap-3">
              {tournamentHistory.map(item => (
                <HistoryCard key={item.id} item={item} onView={onViewTournament} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// ─── ChatRoom.tsx ─────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import { motion, Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GameInvite {
  id: number;
  senderId: string;
  gameTitle?: string;
  wager: number;
  status: "pending" | "accepted" | "declined" | "expired";
  expiresAt: number;
  senderName?: string;
  senderAvatar?: string;
}

interface Game {
  id: string;
  name: string;
  image?: string;
  bg?: string;
  accent?: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

type SendInvitePayload = {
  game: Game;
  wager: number;
};

type TextMessage = {
  type: "text";
  id: number;
  text: string;
  sender: string;
  time: string;
};

type GameInviteMessage = {
  type: "game_invite";
  id: number;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  game: Game;
  wager: number;
  createdAt: number;
  expiresAt: number;
  text?: string;
  time?: string;
};

type Message = GameInviteMessage | TextMessage;


const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";
const games = [
  { id: "1", name: "Subway Run", image: "/games/game1.png" },
  { id: "2", name: "Speed Ball", image: "/games/game2.png" },
  { id: "3", name: "Stack Rush", image: "/games/game3.png" },
  { id: "4", name: "Color Hit", image: "/games/game4.png" },
  { id: "5", name: "Jump Dash", image: "/games/game5.png" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isMe = msg.type === "text";

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
// ─── useCountdown.ts ──────────────────────────────────────────────────────────
export function useCountdown(expiresAt: number, isActive: boolean): number {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    if (!isActive) return;
    const tick = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(id);
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [expiresAt, isActive]);

  return timeLeft;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// ─── GameInviteCard ───────────────────────────────────────────────────────────
export function GameInviteCard({
  invite,
  currentUserId,
  onAccept,
//   onDecline,
  onCancel,
  onPlay,
}: {
  invite: GameInvite;
  currentUserId: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onPlay?: () => void;
}) {
  const isSender   = invite.senderId === currentUserId;
  const isPending  = invite.status === "pending";
  const timeLeft   = useCountdown(invite.expiresAt, isPending);
  const wagerLabel = invite.wager > 0 ? `₦${invite.wager.toLocaleString()} wager` : "Free play";

  // Auto-expired
  if ((timeLeft <= 0 && isPending) || invite.status === "expired") {
    return (
      <div className="flex flex-col items-center gap-1 py-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
          Invite expired
        </p>
      </div>
    );
  }

  if (invite.status === "declined") {
    return (
      <div className="flex flex-col items-center gap-1 py-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <p className="text-[12px] font-semibold text-red-400">Invite declined</p>
      </div>
    );
  }

  if (invite.status === "accepted") {
    return (
      <div className="rounded-2xl p-4 text-center"
        style={{ background: "rgba(9,242,166,0.06)", border: "0.5px solid rgba(9,242,166,0.2)" }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2.5"
          style={{ background: "rgba(9,242,166,0.12)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-[14px] font-extrabold text-white mb-0.5">Match Active!</p>
        <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
          {invite.gameTitle} · {wagerLabel}
        </p>
        <button onClick={onPlay}
          className="w-full py-3 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ background: ACCENT, color: ACCENT_TEXT }}>
          Play Now 🎮
        </button>
      </div>
    );
  }

  // Pending — sender view
  if (isSender) {
    return (
      <div className="rounded-2xl p-4 bg-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(9,242,166,0.1)", border: "0.5px solid rgba(9,242,166,0.2)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="6" width="20" height="14" rx="3"/>
              <path d="M8 10v4M6 12h4M14 11h4M14 13h4"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">Game Invite Sent</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {invite.gameTitle} · {wagerLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Expires in</p>
            <p className="text-[14px] font-extrabold text-[#FBBF24]"
              style={{ animation: "timerPulse 1.5s infinite" }}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        {/* Waiting avatars */}
        <div className="flex items-center justify-center gap-2.5 py-2.5 mb-3">
          <img src={`https://api.dicebear.com/9.x/big-smile/svg?seed=me&radius=50`}
            className="w-9 h-9 rounded-full"
            style={{ border: `2px solid ${ACCENT}` }} />
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>waiting for</p>
          <img src={invite.senderAvatar ?? `https://api.dicebear.com/9.x/big-smile/svg?seed=friend&radius=50`}
            className="w-9 h-9 rounded-full"
            style={{ border: "2px solid rgba(255,255,255,0.2)" }} />
        </div>

        <button onClick={onCancel}
          className="w-full py-2.5 rounded-2xl text-[13px] font-bold active:scale-[0.97] transition-transform"
          style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          Cancel Invite
        </button>
      </div>
    );
  }

  // Pending — receiver view
  return (
    <div className="rounded-2xl p-4 bg-white/5">
      <div className="flex items-center gap-3 mb-4">
        <img src={invite.senderAvatar ?? `https://api.dicebear.com/9.x/big-smile/svg?seed=sender&radius=50`}
          className="w-11 h-11 rounded-full flex-shrink-0"
          style={{ border: `2px solid rgba(9,242,166,0.4)` }} />
        <div className="flex-1">
          <p className="text-[13px] font-bold text-white">
            {invite.senderName ?? "Someone"} challenged you!
          </p>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {invite.gameTitle} · {wagerLabel}
          </p>
        </div>
        <p className="text-[14px] font-extrabold flex-shrink-0 text-[#FBBF24]"
          style={{ animation: "timerPulse 1.5s infinite" }}>
           <span className="block text-[12px]">Expires in: </span>
          {formatTime(timeLeft)}
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onAccept}
          className="flex-1 py-3 w-full rounded-2xl text-[13px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ background: ACCENT, color: ACCENT_TEXT, border: "none" }}>
          Open
        </button>
      </div>
    </div>
  );
}

// ─── GamePicker ───────────────────────────────────────────────────────────────
type Step = 1 | 2 | "loading" | 3;

const WAGER_PRESETS = [100, 250, 500, 1000];

export function GamePicker({
  games,
  currentUser,
  friend,
  onClose,
  onSendInvite,
}: {
  games: Game[];
  currentUser: User;
  friend: User;
  onClose: () => void;
  onSendInvite: (data: { game: Game; wager: number }) => void;
}) {
  const [step, setStep]               = useState<Step>(1);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [wager, setWager]             = useState("");

  const wagerNum   = Number(wager) || 0;
  const wagerLabel = wagerNum > 0 ? `₦${wagerNum.toLocaleString()}` : "Free";

  const goToLoading = () => {
    setStep("loading");
    setTimeout(() => setStep(3), 2800);
  };

  const steps: Record<Exclude<Step, "loading">, number> = { 1: 1, 2: 2, 3: 3 };
  const currentStepNum = step === "loading" ? 2 : (steps[step as Exclude<Step,"loading">] ?? 1);

  const StepDots = () => (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map(n => (
        <div key={n} className="w-2 h-2 rounded-full transition-all"
          style={{ background: n === currentStepNum ? ACCENT : "var(--color-border-tertiary)" }} />
      ))}
    </div>
  );

  // Step 1 — Game selection
  if (step === 1) return (
    <div className="p-2 pb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Choose a Game</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">Pick what you want to play</p>
        </div>
        <StepDots />
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {games.map(game => (
          <button key={game.id} onClick={() => setSelectedGame(game)}
            className="rounded-2xl overflow-hidden text-left transition-all active:scale-95 relative"
            style={{
              border: `2px solid ${selectedGame?.id === game.id ? ACCENT : "var(--color-border-tertiary)"}`,
              boxShadow: selectedGame?.id === game.id ? `0 0 0 1px rgba(9,242,166,0.15)` : "none",
            }}>
            {selectedGame?.id === game.id && (
              <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center z-10"
                style={{ background: ACCENT }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                  stroke={ACCENT_TEXT} strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
            {game.image ? (
              <img src={game.image} alt={game.name} className="w-full h-[70px] object-cover"/>
            ) : (
              <div className="h-[70px] flex items-center justify-center"
                style={{ background: game.bg ?? "#0a0a0a" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke={game.accent ?? ACCENT} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.8 }}>
                  <rect x="2" y="6" width="20" height="14" rx="3"/>
                  <path d="M8 10v4M6 12h4M14 11h4M14 13h4"/>
                </svg>
              </div>
            )}
            <div className="px-2 py-1.5 bg-white dark:bg-white/5">
              <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate">{game.name}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-2.5">
        <button onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold text-gray-500 dark:text-white/50
            bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8 active:scale-[0.97] transition-transform">
          Cancel
        </button>
        <button onClick={() => setStep(2)} disabled={!selectedGame}
          className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: ACCENT, color: ACCENT_TEXT, border: "none" }}>
          Next →
        </button>
      </div>
    </div>
  );

  // Step 2 — Wager
  if (step === 2) return (
    <div className="p-2 pb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Set Wager</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">{selectedGame?.name} · Enter 0 to play free</p>
        </div>
        <StepDots />
      </div>

      <div className="mb-3">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Wager Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold transition-colors"
            style={{ color: wagerNum > 0 ? ACCENT : "var(--color-text-tertiary)" }}>₦</span>
          <input type="text" inputMode="numeric" placeholder="0" value={wager}
            onChange={e => setWager(e.target.value)}
            className="w-full h-[52px] pl-8 pr-4 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/8
              bg-gray-50 dark:bg-white/5 text-[18px] font-bold text-gray-900 dark:text-white
              outline-none focus:border-[#09f2a6] focus:shadow-[0_0_0_4px_rgba(9,242,166,0.08)]
              placeholder:text-gray-300 dark:placeholder:text-white/20 transition-all" />
        </div>
        <p className="text-[12px] text-gray-400 mt-1.5">
          Balance: <span className="font-bold text-gray-700 dark:text-white/70">₦12,700</span>
        </p>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2 mb-5">
        {WAGER_PRESETS.map(w => (
          <button key={w} onClick={() => setWager(String(w))}
            className="flex-1 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95"
            style={{
              background: wagerNum === w ? ACCENT : "transparent",
              color:      wagerNum === w ? ACCENT_TEXT : "var(--color-text-secondary)",
              border:     `0.5px solid ${wagerNum === w ? ACCENT : "var(--color-border-tertiary)"}`,
            }}>
            ₦{w}
          </button>
        ))}
      </div>

      <div className="flex gap-2.5">
        <button onClick={() => setStep(1)}
          className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold text-gray-500 dark:text-white/50
            bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8 active:scale-[0.97] transition-transform">
          ← Back
        </button>
        <button onClick={goToLoading}
          className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ background: ACCENT, color: ACCENT_TEXT, border: "none" }}>
          Confirm →
        </button>
      </div>
    </div>
  );

  // Loading
  if (step === "loading") return (
    <div className="py-16 px-5 flex flex-col items-center justify-center gap-5">
      <div className="w-14 h-14 rounded-full border-[3px] border-t-[#09f2a6]"
        style={{ borderColor: "rgba(9,242,166,0.15)", borderTopColor: ACCENT, animation: "spin 0.8s linear infinite" }} />
      <div className="text-center">
        <p className="text-[17px] font-extrabold text-gray-900 dark:text-white mb-1">Setting up match...</p>
        <p className="text-[13px] text-gray-400">Just a moment</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: ACCENT, animation: `pulse 1.2s ease-in-out infinite`, animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );

  // Step 3 — VS Summary
  return (
    <div className="p-2 pb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Match Summary</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">Review before sending invite</p>
        </div>
        <StepDots />
      </div>

      {/* VS Arena */}
      <div className="relative rounded-[20px] p-6 mb-5 overflow-hidden"
        style={{ animation: "matchFound 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>

        <div className="relative flex items-center justify-center gap-4">
          {/* You */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute inset-[-4px] rounded-full"
                style={{ border: `1.5px solid rgba(9,242,166,0.3)`, animation: "pulse 2s ease-in-out infinite" }} />
              <img src={currentUser.avatar ??
                `https://api.dicebear.com/9.x/big-smile/svg?seed=${currentUser.id}&radius=50&backgroundColor=ffd5dc`}
                className="w-14 h-14 rounded-full relative block"
                style={{ border: `2.5px solid ${ACCENT}` }} />
            </div>
            <p className="text-[12px] font-bold text-white">You</p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[22px] font-extrabold leading-none"
              style={{ color: ACCENT, animation: "vsPulse 1.2s ease-in-out infinite" }}>VS</p>
            <p className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.25)" }}>{selectedGame?.name}</p>
          </div>

          {/* Friend */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <img src={friend.avatar ??
              `https://api.dicebear.com/9.x/big-smile/svg?seed=${friend.id}&radius=50&backgroundColor=b6e3f4`}
              className="w-14 h-14 rounded-full block"
              style={{ border: "2.5px solid rgba(255,255,255,0.2)" }} />
            <p className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
              {friend.name}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8 mb-5">
        {[
          ["Game",       selectedGame?.name ?? "—"],
          ["Wager",      wagerLabel],
          ["Expires in", "2 minutes"],
        ].map(([label, value], i) => (
          <div key={label}
            className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-white/8 last:border-0"
            style={{ background: i % 2 === 1 ? "var(--color-background-secondary)" : "var(--color-background-primary)" }}>
            <span className="text-[13px] text-gray-400">{label}</span>
            <span className="text-[13px] font-bold text-gray-900 dark:text-white">{value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3"
          style={{ background: "rgba(9,242,166,0.05)" }}>
          <span className="text-[13px] text-gray-400">Status</span>
          <span className="text-[13px] font-bold" style={{ color: ACCENT }}>Ready to send</span>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold text-gray-500 dark:text-white/50
            bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8 active:scale-[0.97] transition-transform">
          Cancel
        </button>
        <button onClick={() => onSendInvite({ game: selectedGame!, wager: wagerNum })}
          className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ background: ACCENT, color: ACCENT_TEXT, border: "none" }}>
          Send Invite 🎮
        </button>
      </div>
    </div>
  );
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [hasGame, setHasGame] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const inviteVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
        },
    },
    };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { type: "text", id: Date.now(), text: input.trim(), sender: "me", time: now() }]);
    setInput("");
  };

//   const sendGameChallenge = () => {
//     setMessages(m => [...m, { id: Date.now(), text: "", sender: "me", time: now(), type: "game-challenge" }]);
//   };

  const handleSendInvite = ({ game, wager }: SendInvitePayload) => {
    const newInvite: GameInviteMessage = {
        id: Date.now(),
        type: "game_invite",
        senderId: "me",
        receiverId: "other",
        status: "pending",
        game,
        wager,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000,
    };

    setMessages((prev) => [...prev, newInvite]);

    // close bottom sheet
    setShowGamePicker(false);
    setHasGame(true);
    setOpen(false);
  };

  const canSend = input.trim().length > 0;

  return (
    <div className="h-screen flex flex-col">

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
      {!hasGame ? (
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
      ) : ("")}

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

        {messages.map((msg) => {
        if (msg.type === "game_invite") {
            return (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={inviteVariants}
                >
            <GameInviteCard
                currentUserId="you"
                key={msg.id}
                invite={msg}
                onDecline={() => {console.log("Declined");
                }}
                onAccept={() => {setChallengeOpen(true)}}
                onCancel={() => {console.log("Cancelled");
                }}
            />
            </motion.div>
            );
        }

        return <motion.div
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <MessageBubble msg={msg} key={msg.id} />
        </motion.div>;
        })}
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

          <button onClick={() => {setOpen(true); setShowGamePicker(true)}}
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

      <BottomSheet isOpen={isOpen} onClose={() => {setOpen(false)}} >
        {showGamePicker && (
            <GamePicker
                games={games}
                currentUser={{ id: "1", name: "Michael Alaoma", avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=macala&radius=50&backgroundColor=b6e3f4"}}
                friend={{ id: "1", name: "Vera Chine", avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=vera&radius=50&backgroundColor=b6e3f4"}}
                onClose={() => setShowGamePicker(false)}
                onSendInvite={handleSendInvite}
            />                  
        )}
      </BottomSheet>

        <BottomSheet isOpen={challengeOpen} onClose={() => {setChallengeOpen(false)}} >
            <div className="p-2 pb-8">
                <div className="flex items-start justify-between mb-5">
                    <div>
                    <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Challenge Details</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Review before accepting challenge</p>
                    </div>
                </div>
                {/* VS Arena */}
                <div className="relative rounded-[20px] p-6 mb-5 overflow-hidden"
                    style={{ animation: "matchFound 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>

                    <div className="relative flex items-center justify-center gap-4">
                    {/* You */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative">
                        <div className="absolute inset-[-4px] rounded-full"
                            style={{ border: `1.5px solid rgba(9,242,166,0.3)`, animation: "pulse 2s ease-in-out infinite" }} />
                        <img src={
                            `https://api.dicebear.com/9.x/big-smile/svg?seed=you&radius=50&backgroundColor=ffd5dc`}
                            className="w-14 h-14 rounded-full relative block"
                            style={{ border: `2.5px solid ${ACCENT}` }} />
                        </div>
                        <p className="text-[12px] font-bold text-white">You</p>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[22px] font-extrabold leading-none"
                        style={{ color: ACCENT, animation: "vsPulse 1.2s ease-in-out infinite" }}>VS</p>
                    </div>

                    {/* Friend */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <img src={
                        `https://api.dicebear.com/9.x/big-smile/svg?seed=friend&radius=50&backgroundColor=b6e3f4`}
                        className="w-14 h-14 rounded-full block"
                        style={{ border: "2.5px solid rgba(255,255,255,0.2)" }} />
                        <p className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
                        David
                        </p>
                    </div>
                    </div>
                </div>

                {/* Details */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8 mb-5">
                    {[
                    ["Game",       "Subway Surfers"],
                    ["Wager",      "300"],
                    ["Expires in", "2 minutes"],
                    ].map(([label, value], i) => (
                    <div key={label}
                        className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-white/8 last:border-0"
                        style={{ background: i % 2 === 1 ? "var(--color-background-secondary)" : "var(--color-background-primary)" }}>
                        <span className="text-[13px] text-gray-400">{label}</span>
                        <span className="text-[13px] font-bold text-gray-900 dark:text-white">{value}</span>
                    </div>
                    ))}
                    <div className="flex justify-between items-center px-4 py-3"
                    style={{ background: "rgba(9,242,166,0.05)" }}>
                    <span className="text-[13px] text-gray-400">Status</span>
                    <span className="text-[13px] font-bold" style={{ color: ACCENT }}>Ready to play</span>
                    </div>
                </div>

                <div className="flex gap-2.5">
                    <button
                    className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold text-gray-500 dark:text-white/50
                        bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8 active:scale-[0.97] transition-transform">
                    Decline
                    </button>
                    <button
                    className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
                    style={{ background: ACCENT, color: ACCENT_TEXT, border: "none" }}>
                    Accept
                    </button>
                </div>
            </div>
      </BottomSheet>
    </div>

  );
}
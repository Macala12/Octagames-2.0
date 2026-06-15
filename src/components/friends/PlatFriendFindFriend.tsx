import { useState, useRef, useEffect } from "react";
import { Swords, UserPlus, Check, AlertCircle, Search, X } from "lucide-react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

const ACCENT = "#7C3AED";

/* ------------------ TYPES ------------------ */
interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface GameOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

/* ------------------ MOCK DATA ------------------ */
const CURRENT_USER = {
  name: "You",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const ONLINE_FRIENDS: Friend[] = [
  { id: "1", name: "Michael", avatar: "https://i.pravatar.cc/150?img=3", online: true },
  { id: "2", name: "Chisom", avatar: "https://i.pravatar.cc/150?img=5", online: true },
  { id: "3", name: "Vera", avatar: "https://i.pravatar.cc/150?img=9", online: true },
  { id: "4", name: "David", avatar: "https://i.pravatar.cc/150?img=15", online: true },
  { id: "5", name: "Tomiwa", avatar: "https://i.pravatar.cc/150?img=21", online: true },
  { id: "6", name: "Aisha", avatar: "https://i.pravatar.cc/150?img=25", online: true },
];

const SUGGESTED_FRIENDS: Friend[] = [
  { id: "7", name: "Leo", avatar: "https://i.pravatar.cc/150?img=33", online: false },
  { id: "8", name: "Priya", avatar: "https://i.pravatar.cc/150?img=44", online: true },
  { id: "9", name: "Sam", avatar: "https://i.pravatar.cc/150?img=51", online: false },
  { id: "10", name: "Zainab", avatar: "https://i.pravatar.cc/150?img=47", online: true },
  { id: "11", name: "Kunle", avatar: "https://i.pravatar.cc/150?img=8", online: false },
  { id: "12", name: "Grace", avatar: "https://i.pravatar.cc/150?img=20", online: true },
  { id: "13", name: "Femi", avatar: "https://i.pravatar.cc/150?img=14", online: false },
  { id: "14", name: "Nadia", avatar: "https://i.pravatar.cc/150?img=29", online: true },
];

// Larger pool used for the username search flyout
const ALL_FRIENDS: Friend[] = [
  ...SUGGESTED_FRIENDS,
  { id: "15", name: "Tunde", avatar: "https://i.pravatar.cc/150?img=11", online: true },
  { id: "16", name: "Hauwa", avatar: "https://i.pravatar.cc/150?img=23", online: false },
  { id: "17", name: "Bayo", avatar: "https://i.pravatar.cc/150?img=17", online: true },
  { id: "18", name: "Esther", avatar: "https://i.pravatar.cc/150?img=31", online: false },
  { id: "19", name: "Chuka", avatar: "https://i.pravatar.cc/150?img=6", online: true },
];

const GAMES: GameOption[] = [
  { id: "1", name: "Subway Run", emoji: "🏃", color: "#FFE4E1" },
  { id: "2", name: "Speed Ball", emoji: "🏀", color: "#E0F2FE" },
  { id: "3", name: "Stack Rush", emoji: "🧱", color: "#FEF3C7" },
  { id: "4", name: "Puzzle Pop", emoji: "🧩", color: "#EDE9FE" },
  { id: "5", name: "Race Mania", emoji: "🏎️", color: "#DCFCE7" },
  { id: "6", name: "Trivia Master", emoji: "🧠", color: "#FCE7F3" },
];

const MIN_WAGER = 100;
const MAX_WAGER = 10000;

/* ------------------ SHARED: AVATAR WITH ONLINE DOT ------------------ */
function Avatar({
  src,
  online,
  size = 64,
  ring = "rgba(124,58,237,0.25)",
}: {
  src: string;
  online?: boolean;
  size?: number;
  ring?: string;
}) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        className="w-full h-full rounded-full object-cover"
        style={{ border: `2px solid ${ring}`, padding: 2, boxSizing: "border-box" }}
      />
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: size * 0.26,
            height: size * 0.26,
            background: "#22C55E",
            border: "2px solid #fff",
          }}
        />
      )}
    </div>
  );
}

/* ------------------ FRIEND CARD (online row) ------------------ */
function FriendCard({ friend, onClick }: { friend: Friend; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 flex-shrink-0 w-[76px] active:scale-95 transition-transform"
    >
      <Avatar src={friend.avatar} online={friend.online} size={64} ring={`${ACCENT}33`} />
      <p className="text-[12px] font-semibold text-gray-900 truncate w-full text-center">
        {friend.name}
      </p>
      <span
        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
        style={{ color: ACCENT, background: `${ACCENT}14` }}
      >
        <Swords size={12} strokeWidth={2.5} />
        Battle
      </span>
    </button>
  );
}

/* ------------------ FIND-FRIEND CARD (grid) ------------------ */
function FindFriendCard({ friend }: { friend: Friend }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar src={friend.avatar} online={friend.online} size={56} ring="rgba(0,0,0,0.08)" />
      <p className="text-[12px] font-semibold text-gray-900 truncate w-full text-center">
        {friend.name}
      </p>
      <button
        onClick={() => setRequested(true)}
        disabled={requested}
        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors"
        style={
          requested
            ? { color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.05)" }
            : { color: ACCENT, background: `${ACCENT}14` }
        }
      >
        <UserPlus size={12} strokeWidth={2.5} />
        {requested ? "Sent" : "Add"}
      </button>
    </div>
  );
}

/* ------------------ BATTLE SHEET CONTENT ------------------ */
function BattleSheetContent({ friend, onClose }: { friend: Friend; onClose: () => void }) {
  const [step, setStep] = useState<"setup" | "success">("setup");
  const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);
  const [wagerMode, setWagerMode] = useState<"free" | "wager" | null>(null);
  const [wagerAmount, setWagerAmount] = useState("");
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    setWagerAmount(value);
    const num = Number(value);
    if (!value) {
      setError("");
    } else if (num < MIN_WAGER) {
      setError(`Minimum wager is ₦${MIN_WAGER.toLocaleString()}`);
    } else if (num > MAX_WAGER) {
      setError(`Maximum wager is ₦${MAX_WAGER.toLocaleString()}`);
    } else {
      setError("");
    }
  };

  const wagerValid =
    wagerMode === "free" ||
    (wagerMode === "wager" &&
      wagerAmount !== "" &&
      Number(wagerAmount) >= MIN_WAGER &&
      Number(wagerAmount) <= MAX_WAGER &&
      !error);

  const canProceed = !!selectedGame && wagerValid;

  if (step === "success") {
    return (
      <div className="flex flex-col items-center text-center px-1 py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: `${ACCENT}14` }}
        >
          <Check size={28} color={ACCENT} strokeWidth={3} />
        </div>
        <h3 className="text-[18px] font-extrabold text-gray-900 mb-1.5">
          Invitation Sent!
        </h3>
        <p className="text-[13px] text-gray-500 mb-7 leading-relaxed px-4">
          Game invitation created successfully with{" "}
          <span className="font-semibold text-gray-900">{friend.name}</span>.
          You'll be notified once they accept.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-bold text-[14px] text-white active:scale-[0.98] transition-transform"
          style={{ background: ACCENT }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="px-1">
      {/* VS Header */}
      <div className="flex items-center justify-center gap-5 mb-6 pt-1">
        <div className="flex flex-col items-center gap-2">
          <Avatar src={CURRENT_USER.avatar} size={60} ring="rgba(0,0,0,0.08)" />
          <span className="text-[12px] font-semibold text-gray-900">{CURRENT_USER.name}</span>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-[11px] flex-shrink-0"
          style={{ background: ACCENT }}
        >
          VS
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar src={friend.avatar} size={60} ring={`${ACCENT}55`} />
          <span className="text-[12px] font-semibold text-gray-900">{friend.name}</span>
        </div>
      </div>

      {/* Game selection */}
      <div className="mb-5">
        <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-3">
          Select Game
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {GAMES.map((g) => {
            const selected = selectedGame?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGame(g)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all active:scale-95"
                style={{
                  border: selected ? `2px solid ${ACCENT}` : "2px solid transparent",
                  background: selected ? `${ACCENT}0D` : "rgba(0,0,0,0.025)",
                }}
              >
                <div
                  className="w-full h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: g.color }}
                >
                  {g.emoji}
                </div>
                <p className="text-[11px] font-semibold text-gray-900 text-center leading-tight">
                  {g.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Match type */}
      <div className="mb-2">
        <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-3">
          Match Type
        </p>
        <div className="flex gap-2.5">
          {(["free", "wager"] as const).map((mode) => {
            const selected = wagerMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setWagerMode(mode)}
                className="flex-1 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  border: selected ? `2px solid ${ACCENT}` : "2px solid rgba(0,0,0,0.07)",
                  background: selected ? `${ACCENT}0D` : "transparent",
                }}
              >
                <span
                  className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 18, height: 18,
                    border: `2px solid ${selected ? ACCENT : "rgba(0,0,0,0.18)"}`,
                  }}
                >
                  {selected && (
                    <span className="block rounded-full" style={{ width: 9, height: 9, background: ACCENT }} />
                  )}
                </span>
                <span className="text-[13px] font-semibold text-gray-900">
                  {mode === "free" ? "Free Match" : "Wager Match"}
                </span>
              </button>
            );
          })}
        </div>

        {wagerMode === "wager" && (
          <div className="mt-3.5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-gray-400">
                ₦
              </span>
              <input
                type="number"
                inputMode="numeric"
                value={wagerAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3.5 rounded-2xl text-[15px] font-bold text-gray-900 outline-none transition-colors"
                style={{
                  background: "rgba(0,0,0,0.025)",
                  border: `1.5px solid ${error ? "#EF4444" : "rgba(0,0,0,0.08)"}`,
                }}
              />
            </div>
            {error ? (
              <p className="flex items-center gap-1.5 text-[12px] font-medium text-red-500 mt-2">
                <AlertCircle size={13} />
                {error}
              </p>
            ) : (
              <p className="text-[11.5px] text-gray-400 mt-2">
                Min ₦{MIN_WAGER.toLocaleString()} · Max ₦{MAX_WAGER.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Proceed */}
      <button
        onClick={() => setStep("success")}
        disabled={!canProceed}
        className="w-full mt-6 py-3.5 rounded-2xl font-bold text-[14px] text-white transition-all active:scale-[0.98] disabled:active:scale-100"
        style={{
          background: ACCENT,
          opacity: canProceed ? 1 : 0.35,
          cursor: canProceed ? "pointer" : "not-allowed",
        }}
      >
        Send Battle Invite
      </button>
    </div>
  );
}

/* ------------------ FRIEND SEARCH RESULT ROW (dropdown) ------------------ */
function FriendSearchRow({ friend }: { friend: Friend }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <Avatar src={friend.avatar} online={friend.online} size={40} ring="rgba(0,0,0,0.08)" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 truncate">{friend.name}</p>
        <p className="text-[11px] text-gray-400">@{friend.name.toLowerCase()}</p>
      </div>
      <button
        onClick={() => setRequested(true)}
        disabled={requested}
        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full transition-colors flex-shrink-0"
        style={
          requested
            ? { color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.05)" }
            : { color: ACCENT, background: `${ACCENT}14` }
        }
      >
        <UserPlus size={12} strokeWidth={2.5} />
        {requested ? "Sent" : "Add"}
      </button>
    </div>
  );
}

/* ------------------ FIND FRIENDS SHEET CONTENT ------------------ */
function FindFriendsContent() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results =
    query.trim().length > 0
      ? ALL_FRIENDS.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  return (
    <div className="px-1">
      {/* Search bar */}
      <div className="relative mb-5" ref={containerRef}>
        <div className="relative">
          <Search
            size={16}
            strokeWidth={2.5}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search by username..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl text-[13px] font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400"
            style={{ background: "rgba(0,0,0,0.025)", border: "1.5px solid rgba(0,0,0,0.08)" }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpen(false); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Search flyout */}
        {open && query.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl overflow-hidden bg-white shadow-xl max-h-[260px] overflow-y-auto"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {results.length === 0 ? (
              <p className="text-[12px] text-gray-400 px-4 py-4">
                No users found for "{query}"
              </p>
            ) : (
              results.map((f, i) => (
                <div key={f.id} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
                  <FriendSearchRow friend={f} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-4">
        Suggested Friends
      </p>
      <div className="grid grid-cols-4 gap-x-2 gap-y-5">
        {SUGGESTED_FRIENDS.map((f) => (
          <FindFriendCard key={f.id} friend={f} />
        ))}
      </div>
    </div>
  );
}

/* ------------------ MAIN EXPORT ------------------ */
export default function OnlineFriends() {
  const [battleFriend, setBattleFriend] = useState<Friend | null>(null);
  const [findOpen, setFindOpen] = useState(false);

  return (
    <div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Friends Online</h2>
          <span className="text-[12px] font-semibold text-gray-400">
            {ONLINE_FRIENDS.length} online
          </span>
        </div>

        <button
          onClick={() => setFindOpen(true)}
          className="py-2.5 px-3.5 rounded-[30px] text-[12px] font-bold transition-colors"
          style={{ color: ACCENT, background: `${ACCENT}14` }}
        >
          Find Friends
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {ONLINE_FRIENDS.map((f) => (
          <FriendCard key={f.id} friend={f} onClick={() => setBattleFriend(f)} />
        ))}
      </div>

      {/* Battle sheet */}
      <BottomSheet title="" isOpen={!!battleFriend} onClose={() => setBattleFriend(null)} background="">
        {battleFriend && (
          <BattleSheetContent friend={battleFriend} onClose={() => setBattleFriend(null)} />
        )}
      </BottomSheet>

      {/* Find friends sheet */}
      <BottomSheet title="" isOpen={findOpen} onClose={() => setFindOpen(false)} background="">
        <FindFriendsContent />
      </BottomSheet>
    </div>
  );
}
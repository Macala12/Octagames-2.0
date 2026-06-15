import { useState, useRef, useEffect } from "react";

const ACCENT = "#7C3AED";
const ACCENT_TEXT = "#003322";

interface GameResult {
  code: string;
  hostName: string;
  hostAvatar?: string;
  playerCount: number;
  maxPlayers: number;
  mode: string;
}

interface FriendGameSearchProps {
  onJoinGame?: (code: string) => void;
  // In a real app this would hit your backend; kept as a prop so it's swappable
  searchGames?: (code: string) => Promise<GameResult[]>;
}

// Mock search — replace with a real API call
const mockSearch = async (code: string): Promise<GameResult[]> => {
  await new Promise((r) => setTimeout(r, 350));
  if (code.length < 4) return [];

  return [
    {
      code,
      hostName: "Jordan",
      playerCount: 3,
      maxPlayers: 8,
      mode: "Classic",
    },
  ];
};

export default function FriendGameSearch({
  onJoinGame,
  searchGames = mockSearch,
}: FriendGameSearchProps) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GameResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (code.length < 4) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const timeout = setTimeout(async () => {
      try {
        const res = await searchGames(code);
        setResults(res);
        if (res.length === 0) setError("No game found with that code.");
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [code, searchGames]);

  const canJoin = code.length >= 4;

  return (
    <div ref={containerRef}>
      <p className="text-[14px] font-extrabold text-gray-900 dark:text-white mb-1">
        Search for a friend's game
      </p>
      <p className="text-[12px] text-gray-400 mb-3">
        Enter a game code to join a private game created by your friend.
      </p>

      <div className="relative">
        <div className="relative">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && canJoin && onJoinGame?.(code)}
            placeholder="Type game code..."
            maxLength={8}
            className="w-full px-4 pr-11 py-3.5 text-[14px] font-semibold tracking-widest outline-none transition-all
              bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8
              text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20
              focus:border-[#7C3AED]"
          />
          <button
            onClick={() => canJoin && onJoinGame?.(code)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: canJoin ? ACCENT : "var(--color-border-tertiary)" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={canJoin ? ACCENT_TEXT : "var(--color-text-tertiary)"}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Dropdown panel */}
        {open && code.length >= 4 && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden
              bg-white dark:bg-[#15171c] border border-gray-200 dark:border-white/8 rounded-xl"
          >
            {loading && (
              <div className="px-4 py-4 flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-white/15 animate-spin"
                  style={{ borderTopColor: ACCENT }}
                />
                <span className="text-[12px] text-gray-400">Searching for game...</span>
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-4">
                <p className="text-[12px] text-gray-400">{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              results.map((game) => (
                <button
                  key={game.code}
                  onClick={() => onJoinGame?.(game.code)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{ background: `${ACCENT}22`, color: ACCENT }}
                  >
                    {game.hostName.slice(0, 1)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                      {game.hostName}'s game
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {game.mode} · {game.playerCount}/{game.maxPlayers} players
                    </p>
                  </div>

                  <span
                    className="text-[11px] font-bold tracking-widest px-2 py-1 rounded-md flex-shrink-0"
                    style={{ background: `${ACCENT}1A`, color: ACCENT }}
                  >
                    {game.code}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";

interface Game {
  id: string;
  title: string;
  image: string;
  plays: number;
}

interface Props {
  games: Game[];
  balance?: number;
  onProceed?: (data: { gameId: string; wager: number; potentialWin: number }) => void;
}

const WAGER_OPTIONS = [50, 100, 200, 500];
const RAKE = 0.05;

function formatPlays(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}

function calcWin(wager: number) {
  const fee = Math.round(wager * RAKE);
  return { win: wager * 2 - fee, fee };
}

const PlayStrangerContent: React.FC<Props> = ({
  games,
  balance = 350,
  onProceed,
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [wager, setWager]               = useState(100);
  const [matching, setMatching]         = useState(false);

  const { win, fee }   = calcWin(wager);
  const insufficient   = wager > balance;
  const canProceed     = !!selectedGame && !insufficient;

  const handleFind = () => {
    if (!canProceed) return;
    setMatching(true);
    // Simulate matchmaking — replace with real socket/API call
    setTimeout(() => {
      setMatching(false);
      onProceed?.({ gameId: selectedGame!, wager, potentialWin: win });
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-5 relative">

      {/* Matchmaking overlay */}
      {matching && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center gap-5">
          <div className="w-14 h-14 rounded-full border-[3px] border-[#09f2a6]/20 border-t-[#09f2a6] animate-spin" />
          <div className="text-center">
            <p className="text-[18px] font-extrabold text-white mb-1">Finding a player...</p>
            <p className="text-[13px] text-white/40">Usually under 30 seconds</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#09f2a6] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <button
            onClick={() => setMatching(false)}
            className="mt-2 rounded-full px-5 py-2 text-xs font-semibold text-white/40"
            style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.12)" }}>
            Cancel
          </button>
        </div>
      )}

      {/* Game selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-extrabold text-gray-900 dark:text-white">Select Game</p>
          <p className="text-[11px]" style={{ color: selectedGame ? "#000" : "var(--color-text-tertiary)" }}>
            {selectedGame
              ? games.find(g => g.id === selectedGame)?.title + " selected"
              : "Choose one to continue"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform relative"
              style={{
                border: selectedGame === game.id
                  ? "2px solid #09f2a6"
                  : "2px solid transparent",
                boxShadow: selectedGame === game.id
                  ? "0 0 0 1px rgba(9,242,166,0.2)"
                  : "none",
              }}
            >
              {/* Checkmark */}
              {selectedGame === game.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full z-10 flex items-center justify-center"
                  style={{ background: "#09f2a6" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#022b1e" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Image */}
              <div className="h-20 relative overflow-hidden">
                <img src={game.image} alt={game.title}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Info */}
              <div className="px-2 py-2 bg-white dark:bg-white/5">
                <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{game.title}</p>
                <p className="text-[10px] text-gray-400">{formatPlays(game.plays)} plays</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wager selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[14px] font-extrabold text-gray-900 dark:text-white">Select Wager</p>
          <p className="text-[11px] text-gray-400">Deducted on match</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {WAGER_OPTIONS.map(w => (
            <button
              key={w}
              onClick={() => setWager(w)}
              className="px-4 py-2 rounded-full text-[13px] font-bold border-[1.5px] transition-all active:scale-95"
              style={wager === w
                ? { background: "#09f2a6", borderColor: "#09f2a6", color: "#022b1e" }
                : { background: "transparent", border: "0px solid transparent" ,color: "var(--color-text-primary)" }
              }>
              {w.toLocaleString()} 🪙
            </button>
          ))}
        </div>
      </div>

      {/* Potential win tile */}
      <div className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-2xl px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[11px] flex items-center justify-center"
            style={{ background: "rgba(9,242,166,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#09f2a6" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
              Potential Win
            </p>
            <p className="text-[20px] font-extrabold" style={{ color: "#09f2a6" }}>
              N{win.toLocaleString()} 
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 mb-0.5">Platform fee</p>
          <p className="text-[12px] font-semibold text-gray-500">
            N{fee} (5%)
          </p>
        </div>
      </div>

      {/* CTA */}
      <div>
        <button
          onClick={handleFind}
          disabled={!canProceed}
          className="w-full py-4 rounded-2xl text-[14px] font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          style={
            !selectedGame
              ? { background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", cursor: "not-allowed" }
              : insufficient
              ? { background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "not-allowed" }
              : { background: "#09f2a6", color: "#022b1e" }
          }>
          {!selectedGame ? "Select a game first" : insufficient
            ? `Need ${(wager - balance).toLocaleString()} more coins`
            : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#022b1e" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Find Player
              </>
            )}
        </button>
        {canProceed && (
          <p className="text-center text-[11px] text-gray-400 mt-2">
            Usually matched in under 30s
          </p>
        )}
        {insufficient && (
          <p className="text-center text-[11px] text-red-400 mt-2">
            Top up your coins to continue
          </p>
        )}
      </div>

    </div>
  );
};

export default PlayStrangerContent;
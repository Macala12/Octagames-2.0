import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Tournament {
  id: string;
  title: string;
  image?: string;
  bg?: string;
  accentColor?: string;
  publisher?: string;
  tag?: string;
  prize: string;           // display string e.g. "₦3,000"
  prizePool?: string;      // total pool e.g. "₦50,000"
  playersCount: number;
  maxPlayers?: number;
  minCoins: number;
  maxCoins: number;
  endTime: string;         // ISO string
  difficulty?: "easy" | "medium" | "hard";
  playerAvatars?: string[];
  topScore?: number;       // current leaderboard top score
  yourScore?: number;      // logged-in user's current score
  yourRank?: number;
  isJoined?: boolean;
}

interface Props {
  tournaments: Tournament[];
  onPlay?: (tournament: Tournament) => void;
}

const ACCENT      = "#7C3AED";
const ACCENT_TEXT = "#022b1e";

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return timeLeft;
}

// function DifficultyBadge({ level }: { level?: "easy" | "medium" | "hard" }) {
//   if (!level) return null;
  
//   const configs = {
//     easy: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#4ade80", label: "EASY" },
//     medium: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.3)", text: "#facc15", label: "MED" },
//     hard: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#f87171", label: "HARD" },
//   };
  
//   const config = configs[level];
  
//   return (
//     <span 
//       className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded"
//       style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
//     >
//       {config.label}
//     </span>
//   );
// }

function TimerDisplay({ timeLeft, accent }: { timeLeft: string; accent: string }) {
  const parts = timeLeft.split(/[: ]/).filter(Boolean);
  
  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <div className="absolute inset-0 opacity-10 blur-sm" style={{ color: accent }} />
        <div className="relative flex items-center gap-0.5 bg-black/40 backdrop-blur-md rounded-lg px-2.5 py-1.5">
          {parts.map((part, i) => (
            <span key={i} className="flex items-center">
              <span className="text-[19px] font-black tabular-nums" style={{ color: accent }}>
                {part}
              </span>
              {i < parts.length - 1 && (
                <span className="text-[16px] font-bold mx-0.5" style={{ color: accent, opacity: 0.5 }}>:</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, max, accent }: { current: number; max?: number; accent: string }) {
  if (!max) return null;
  const pct = Math.min((current / max) * 100, 100);
  const isFull = pct >= 90;
  
  return (
    <div className="flex items-center gap-2 mt-1.5 w-50">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 relative"
          style={{ 
            width: `${pct}%`, 
            background: isFull ? `linear-gradient(90deg, ${accent}, #ef4444)` : accent,
            boxShadow: isFull ? `0 0 8px ${accent}` : "none",
          }}
        >
          {isFull && (
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
          )}
        </div>
      </div>
      <span className="text-[9px] font-bold tabular-nums" style={{ color: isFull ? "#ef4444" : "rgba(255,255,255,0.4)" }}>
        {pct >= 100 ? "FULL" : `${Math.round(pct)}%`}
      </span>
    </div>
  );
}

// function CoinBadge({ amount, accent }: { amount: number; accent: string }) {
//   return (
//     <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
//       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5">
//         <circle cx="12" cy="12" r="8"/>
//         <path d="M12 8v8M9 12h6" strokeLinecap="round"/>
//       </svg>
//       <span style={{ color: accent }}>{amount.toLocaleString()}</span>
//     </span>
//   );
// }

export default function TournamentCard({
  tournament,
  onPlay,
}: {
  tournament: Tournament;
  onPlay?: (t: Tournament) => void;
}) {
  const navigate = useNavigate();
  const timeLeft = useCountdown(tournament.endTime);
  const accent = tournament.accentColor ?? ACCENT;
  const isFull = tournament.maxPlayers && tournament.playersCount >= tournament.maxPlayers;
  const isEndingSoon = timeLeft.includes("m") || timeLeft.includes("s");
  
  return (
    <div
      onClick={() => navigate("/tournament")}
      className="rotate-[-2deg] w-full border border-t flex-shrink-0 overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-200 hover:brightness-110 group"
      style={{ 
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)`,
      }}
    >
      {/* Full-height cover area */}
      <div className="relative overflow-hidden">
        
        {/* Game cover image */}
        <div className="flex relative">
          {tournament.image ? (
            <div className="relative w-[50%] overflow-hidden">
              <img
                src={tournament.image}
                alt={tournament.title}
                className="w-full h-[120px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>
          ) : (
            <div
              className="w-[50%] h-[120px]"
              style={{ background: tournament.bg ?? "linear-gradient(135deg,#1a0533,#7C3AED)" }}
            />
          )}
          
          <div className="w-1/2 bg-[#141414] relative flex flex-col items-center justify-center px-3">
            {/* Title */}
            <h3 className="text-[22px] mt-5 font-extrabold text-white leading-tight mb-2 line-clamp-2">
              {tournament.title}
            </h3>
            
            {/* Timer */}
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold mr-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                {isEndingSoon ? "ENDING" : "ENDS IN"}
              </span>
              <TimerDisplay timeLeft={timeLeft} accent={isEndingSoon ? "#ef4444" : accent} />
            </div>
            
            {/* Tag row */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 flex-wrap">
              {tournament.tag && (
                <span 
                  className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded"
                  style={{ background: accent, color: ACCENT_TEXT }}
                >
                  {tournament.tag.toUpperCase()}
                </span>
              )}
              {isFull && (
                <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-red-400">
                  FULL
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Players count pill - positioned over image */}
        <div 
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ 
            background: "rgba(0,0,0,0.5)", 
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "0.5px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" opacity="0.9">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span className="text-[10px] font-bold text-white/90 tabular-nums">
            {tournament.playersCount.toLocaleString()}
            {tournament.maxPlayers && (
              <span className="text-white/40">/{tournament.maxPlayers.toLocaleString()}</span>
            )}
          </span>
        </div>

        {/* ── FROSTED BOTTOM PANEL ── */}
        <div
          className="px-4 pt-3 pb-3.5 relative"
          style={{
            background: "linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(14,14,14,0.98) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Top info row */}
          <div className="flex items-center justify-between mb-2 w-[fit-content]">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="white" opacity="0.6">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {tournament.publisher ?? "Octagames Studio"}
              </span>
            </div>        
          </div>

          {/* Prize + Stats row */}
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              {/* Prize display */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[24px] font-black text-white leading-none tracking-tight">
                  {tournament.prize}
                </span>
                {tournament.prizePool && (
                  <span className="text-[24px] font-black text-white leading-none tracking-tight">
                    - {tournament.prizePool}
                  </span>
                )}
              </div>
              
              {/* Progress bar for player slots */}
              <ProgressBar 
                current={tournament.playersCount} 
                max={tournament.maxPlayers} 
                accent={accent} 
              />
              
              {/* Score info */}
              <div className="flex items-center gap-3 mt-2">
                {tournament.topScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-amber-400 tabular-nums">
                      {tournament.topScore.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-white/30">top</span>
                  </div>
                )}
                
                {tournament.yourScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${tournament.isJoined ? "bg-emerald-400" : "bg-white/20"}`} />
                    <span className="text-[10px] font-bold text-white/70 tabular-nums">
                      {tournament.yourScore.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-white/30">you</span>
                    {tournament.yourRank && (
                      <span className="text-[9px] font-black px-1 rounded bg-white/10 text-white/50 ml-0.5">
                        #{tournament.yourRank}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>          

            {/* Avatar stack + Play button column */}
            <div className="flex flex-col items-end gap-2 -mt-3">
              {/* Avatar stack */}
              <div className="flex items-center">
                <div className="flex items-center -space-x-2 mr-2">
                  {(tournament.playerAvatars ?? []).slice(0, 4).map((src, i) => (
                    <img 
                      key={i} 
                      src={src} 
                      alt="" 
                      className="w-5 h-5 rounded-full object-cover border-2 border-[#141414] transition-transform group-hover:translate-x-0.5"
                      style={{ 
                        marginLeft: i > 0 ? -1 : 0, 
                        zIndex: 4 - i,
                        transitionDelay: `${i * 50}ms`,
                      }} 
                    />
                  ))}
                  {tournament.playersCount > 4 && (
                    <div className="w-7 h-7 ml-1 rounded-full bg-white/10 border-2 border-[#141414] flex items-center justify-center text-[8px] font-bold text-white/60 z-0">
                      +{tournament.playersCount - 4}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Play button - THE CTA */}
              <button
                onClick={e => { e.stopPropagation(); onPlay?.(tournament); }}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 text-[13px] font-black 
                  transition-all duration-200 overflow-hidden
                  ${tournament.isJoined 
                    ? "bg-[#7C3AED] text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                    : "bg-white text-black hover:bg-white/90 hover:scale-105 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  }
                  ${isFull && !tournament.isJoined ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                `}
                disabled={!!(isFull && !tournament.isJoined)}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span>
                  {tournament.isJoined ? "RESUME" : isFull ? "FULL" : "PLAY"} {tournament.minCoins}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TournamentCarousel: React.FC<Props> = ({ tournaments, onPlay }) => {
  return (
    <div className="mt-2">
      <div className="pb-2">
        {tournaments.map(t => (
          <TournamentCard key={t.id} tournament={t} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
};
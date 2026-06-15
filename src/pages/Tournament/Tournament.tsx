import React, { useState, useEffect } from "react";
import NeubrutalistCard from "../../components/ui/cards/NeuCard";

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  score: number;
  reward: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface TournamentDetailData {
  id: string;
  gameTitle: string;
  gameImage?: string;
  minPot: number;
  maxPot: number;
  endTime: string;
  playerCount: number;
  maxPlayers: number;
  joinCost: number;
  leaderboard: LeaderboardPlayer[];
}

interface Props {
  data: TournamentDetailData;
  balance?: number;
  onBack?: () => void;
  onJoin?: () => void;
  onPractice?: () => void;
  onShare?: () => void;
  onHelp?: () => void;
  players: LeaderboardPlayer[];
}

const ACCENT      = "#7C3AED";
const ACCENT_TEXT = "#022b1e";

// --- Countdown ---
function useCountdown(endTime: string) {
  const [parts, setParts] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return;
      setParts({
        d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return parts;
}

// --- Timer display ---
function TimerDisplay({ endTime }: { endTime: string }) {
  const { d, h, m, s } = useCountdown(endTime);
  const segs = [{ v: d, l: "Days" }, { v: h, l: "Hrs" }, { v: m, l: "Min" }, { v: s, l: "Sec" }];
  return (
    <div className="flex items-center gap-1">
      {segs.map((seg, i) => (
        <React.Fragment key={seg.l}>
          {i > 0 && <span className="text-[18px] font-bold text-gray-300 dark:text-white/30 pb-1">:</span>}
          <div className="flex flex-col items-center">
            <span className="text-[22px] font-extrabold text-gray-900 dark:text-white leading-none">{seg.v}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mt-0.5">{seg.l}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// --- Podium ---
export function Podium({ players }: Props) {
  const first  = players.find(p => p.rank === 1);
  const second = players.find(p => p.rank === 2);
  const third  = players.find(p => p.rank === 3);
 
  const slots = [
    { 
      player: second, 
      rank: 2, 
      emoji: "🥈",
      color: "#94a3b8", 
      barH: 90, 
      avatarSize: 56,
    },
    { 
      player: first,  
      rank: 1, 
      emoji: "🥇",
      color: "#FBBF24", 
      barH: 120, 
      avatarSize: 72,
    },
    { 
      player: third,  
      rank: 3, 
      emoji: "🥉",
      color: "#CD7F32", 
      barH: 70,  
      avatarSize: 52,
    },
  ];
 
  const animDelay = ["0.2s", "0s", "0.4s"];
 
  return (
    <div className="mb-8">
      
      {/* Floating crown for winner */}
      <div className="flex justify-center mb-4">
        <span 
          className="text-5xl inline-block"
          style={{ 
            animation: "bounce 2s ease-in-out infinite",
            filter: "drop-shadow(0 4px 12px rgba(251,191,36,0.3))"
          }}
        >
          👑
        </span>
      </div>
 
      {/* Players */}
      <div className="flex items-end justify-center gap-10 mb-2">
        {slots.map((slot, i) => slot.player && (
          <div 
            key={slot.rank} 
            className="flex flex-col items-center"
            style={{ 
              animation: `slideUp 0.5s ease-out`,
              animationDelay: animDelay[i],
              animationFillMode: "backwards"
            }}
          >
            {/* Avatar */}
            <div className="relative mb-3">
              <img
                src={slot.player.avatar ?? 
                  `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${slot.player.username}&radius=50&backgroundColor=ffd5dc`}
                alt={slot.player.username}
                className="rounded-full bg-white"
                style={{ 
                  width: slot.avatarSize, 
                  height: slot.avatarSize,
                  border: `4px solid ${slot.color}`,
                  boxShadow: `0 4px 12px ${slot.color}40`,
                }}
              />
              
              {/* Medal emoji */}
              <div 
                className="absolute -top-2 -right-2 text-2xl"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  animation: slot.rank === 1 ? "wiggle 1s ease-in-out infinite" : "none"
                }}
              >
                {slot.emoji}
              </div>
            </div>
 
            {/* Username */}
            <p className="text-sm font-bold text-white/80 mb-2 text-center max-w-[80px] truncate">
              {slot.player.username}
            </p>
 
            {/* Podium bar */}
            <div 
              className="w-20 rounded-t-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
              style={{ 
                height: slot.barH,
                backgroundColor: slot.color,
              }}
            >
              {/* Glossy shine */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/3"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
                  borderRadius: "16px 16px 0 0"
                }}
              />
 
              {/* Score */}
              <div className="relative z-10">
                <div className="text-2xl font-black text-center text-white mb-1">
                  {slot.rank}
                </div>
                <div className="bg-black/20 rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-white">
                    {slot.player.score.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Reward badge */}
            <div 
              className="mt-4 px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: `${slot.color}30`
              }}
            >
              <span className="text-sm">💰</span>
              <span className="text-sm font-extrabold" style={{ color: slot.color }}>
                {slot.player.reward}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Leaderboard row ---
function LeaderboardRow({ player }: { player: LeaderboardPlayer }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/8 last:border-0
      ${player.isCurrentUser ? "bg-[rgba(9,242,166,0.05)]" : ""}`}>
      <div className="relative flex-shrink-0">
        <img
          src={player.avatar ?? `https://api.dicebear.com/9.x/big-smile/svg?seed=${player.username}&radius=50&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`}
          alt={player.username}
          className="w-11 h-11 rounded-full"
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-px text-[9px] font-extrabold text-white whitespace-nowrap"
          style={{ background: player.isCurrentUser ? ACCENT : "#2d2d2d", color: player.isCurrentUser ? ACCENT_TEXT : "#fff" }}>
          {player.rank}th
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-gray-900 dark:text-white mb-1 truncate">
          {player.username}
          {player.isCurrentUser && (
            <span className="ml-1.5 text-[10px] font-bold" style={{ color: ACCENT }}>(you)</span>
          )}
        </p>
        <div className="inline-block rounded-full px-2.5 py-0.5 bg-gray-100 dark:bg-white/10">
          <span className="text-[13px] font-semibold text-gray-500 dark:text-white">
            {player.score.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-base">🪙</span>
        <span className="text-[14px] font-bold text-gray-900 dark:text-white">{player.reward}</span>
      </div>
    </div>
  );
}

// Confetti component
function ConfettiRain() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    color:    ["#09f2a6","#FBBF24","#fff","#a78bfa","#fde68a"][i % 5],
    left:     `${5 + (i * 3.2) % 90}%`,
    size:     4 + (i % 5),
    delay:    (i * 0.15) % 4,
    duration: 3 + (i % 3),
    radius:   i % 3 === 1 ? "50%" : i % 3 === 2 ? "2px" : "1px",
    rotate:   i * 13,
  }));

  return (
    <>
      {pieces.map((p, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{
            left: p.left, top: -10,
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.radius,
            opacity: 0.7,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }} />
      ))}
    </>
  );
}

// --- Main screen ---
export default function TournamentScreen({
  data, balance = 350, onBack, onJoin, onPractice, onShare, onHelp,
}: Props) {
  const progress = Math.min((data.playerCount / data.maxPlayers) * 100, 100);
  const canJoin  = balance >= data.joinCost;

  const top3 = data.leaderboard.filter(p => p.rank <= 3);
  const rest  = data.leaderboard.filter(p => p.rank > 3);

  return (
    <div className="dark: overflow-hidden">
      {/* Hero */}
      <div className="relative h-[300px] overflow-hidden" style={{ background: "#0a1628" }}>
        {data.gameImage ? (
          <img src={data.gameImage} alt={data.gameTitle} className="absolute inset-0 w-full h-full object-cover opacity-60" style={{background: "linear-gradient(rgba(0, 0, 0, 0) 50%, rgb(11, 12, 16) 100%)"}} />
        ) : (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 220" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hpd" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.05)" />
              </pattern>
              <radialGradient id="hglow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#09f2a6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#09f2a6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="390" height="220" fill="url(#hpd)" />
            <ellipse cx="195" cy="110" rx="180" ry="140" fill="url(#hglow)" />
            <ellipse cx="320" cy="30"  rx="130" ry="90"  fill="#7C3AED" opacity="0.12" />
          </svg>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, #0a0a0a, transparent)` }} />

        {/* Nav */}
        <div className="absolute top-3.5 left-0 right-0 flex items-center justify-between px-4">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="text-[17px] font-extrabold text-white">{data.gameTitle}</p>
          <button onClick={onHelp}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[14px]"
            style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>?</button>
        </div>

        {/* Balance */}
        <div className="absolute p-2 top-20 left-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
            <span className="text-sm">🪙</span>
            <span className="text-[13px] font-extrabold text-white">{balance.toLocaleString()}</span>
          </div>
          <button className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: ACCENT }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Victory pot */}
        <div className="absolute p-2 bottom-4 right-4 text-right">
          <p className="text-[26px] font-extrabold text-white tracking-tight leading-none">
            <span className="text-[#FBBF24]">🪙</span>{data.minPot.toLocaleString()}
            {" – "}
            <span className="text-[#FBBF24]">🪙</span>{data.maxPot.toLocaleString()}
          </p>
          <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Victory Pot</p>
          <p className="text-[12px] text-gray-300 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti alias quod harum assumenda nobis nam quas, est mollitia iure.
          </p>
        </div>
      </div>

      {/* Info card */}
      <div className="mx-5 my-3 rounded-[20px] bg-white dark:bg-white/5 dark:p-4 flex flex-col gap-4">

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(9,242,166,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Tournament ends in...</p>
            <TimerDisplay endTime={data.endTime} />
          </div>
        </div>

        {/* Players progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex" style={{ marginLeft: 0 }}>
              {["angel", "stargal", "solace"].map((seed, i) => (
                <img key={seed}
                  src={`https://api.dicebear.com/9.x/big-smile/svg?seed=${seed}&radius=50&backgroundColor=b6e3f4`}
                  className="w-7 h-7 rounded-full border-2 border-[#7C3AED] dark:border-[#0a0a0a]"
                  style={{ marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }}
                />
              ))}
            </div>
            <p className="text-[12px] font-semibold text-gray-500">
              {data.playerCount} / {data.maxPlayers} players
            </p>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: ACCENT }} />
          </div>
        </div>

        {/* Join */}
        <button onClick={onJoin} disabled={!canJoin}
          className="w-full py-4 rounded-2xl text-[15px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={canJoin
            ? { background: ACCENT, color: ACCENT_TEXT }
            : { background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", cursor: "not-allowed" }}>
          <span className="text-lg">🪙</span>
          {canJoin ? `Join with ${data.joinCost} coins` : `Need ${data.joinCost - balance} more coins`}
        </button>

        <button onClick={onPractice}
          className="w-full py-2.5 text-[14px] font-bold text-center"
          style={{ color: ACCENT }}>
          Practice for Free
        </button>
      </div>

      <NeubrutalistCard
        mainColor="#7C3AED"
        shadowColor="#000"
        pressable
        shadowOffsetX={5}
        shadowOffsetY={5}
        borderRadius={10}
      >
        {/* Share banner */}
        <div className="p-4 relative overflow-hidden">
          <div className="relative flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[22px] font-extrabold text-white leading-tight tracking-tight mb-1.5">
                Share tournament<br />and earn Octacoins
              </p>
              <p className="text-[15px] leading-relaxed text-white/90">
                Earn <span className="font-bold text-black"> 40 coins</span> for every new friend you invite.
              </p>
            </div>
            <span className="text-5xl flex-shrink-0">🪙</span>
          </div>
          <button onClick={onShare}
            className="relative w-full py-3 rounded-[10px] text-[13px] font-extrabold active:scale-[0.97] transition-transform"
            style={{ background: "#0a0a0a", color: "#fff" }}>
            Share to friends
          </button>
        </div>
      </NeubrutalistCard>


      {/* Leaderboard */}
      <div className="px-3 mt-10 pt-5 bg-[#7C3AED] rounded-t-[30px] pb-10 overflow-hidden relative">  
        {ConfettiRain()}           
        <div className="relative z-10">
            {top3.length > 0 && <Podium data={data} players={top3} />}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[20px] mt-3 overflow-hidden">
            {rest.map(player => <LeaderboardRow key={player.rank} player={player} />)}
            </div>   
        </div>
      </div>

    </div>
  );
}
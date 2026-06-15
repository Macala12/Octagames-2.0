"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Trophy, Zap, Crown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface Player {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  streak?: number;
  country?: string;
  isOnline?: boolean;
  winRate?: number;
  isYou?: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────

const TOP_PLAYERS: Player[] = [
  { id: "1", username: "Amaka", avatar: "https://i.pravatar.cc/150?img=5", rank: 1, score: 45200, streak: 12, country: "🇳🇬", isOnline: true, winRate: 78 },
  { id: "2", username: "Kwame", avatar: "https://i.pravatar.cc/150?img=3", rank: 2, score: 38900, streak: 7, country: "🇬🇭", isOnline: true, winRate: 71 },
  { id: "3", username: "Zara", avatar: "https://i.pravatar.cc/150?img=9", rank: 3, score: 34100, streak: 5, country: "🇿🇦", isOnline: false, winRate: 65 },
  { id: "4", username: "David", avatar: "https://i.pravatar.cc/150?img=11", rank: 4, score: 29800, streak: 3, country: "🇰🇪", isOnline: true, winRate: 62 },
  { id: "5", username: "Fatima", avatar: "https://i.pravatar.cc/150?img=16", rank: 5, score: 27500, streak: 0, country: "🇪🇬", isOnline: false, winRate: 58 },
  { id: "6", username: "Sipho", avatar: "https://i.pravatar.cc/150?img=12", rank: 6, score: 25100, streak: 4, country: "🇿🇦", isOnline: true, winRate: 60 },
  { id: "7", username: "You", avatar: "https://i.pravatar.cc/150?img=12", rank: 47, score: 8900, streak: 1, country: "🇳🇬", isOnline: true, winRate: 45, isYou: true },
];

// ─── Rank Badge ──────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const configs: Record<number, { bg: string; text: string; icon: React.ReactNode; size: string }> = {
    1: { 
      bg: "bg-gradient-to-br from-[#FFD60A] to-[#F59E0B] text-white", 
      text: "text-white",
      icon: <Crown size={14} className="fill-white" />,
      size: "w-8 h-8 text-[14px]",
    },
    2: { 
      bg: "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800", 
      text: "text-gray-800",
      icon: <Trophy size={12} />,
      size: "w-7 h-7 text-[13px]",
    },
    3: { 
      bg: "bg-gradient-to-br from-orange-400 to-orange-600 text-white", 
      text: "text-white",
      icon: <Trophy size={12} className="fill-white" />,
      size: "w-7 h-7 text-[13px]",
    },
  };

  const config = configs[rank];

  if (config) {
    return (
      <div className={`absolute top-1 left-1 ${config.size} ${config.bg} rounded-full flex items-center justify-center font-black shadow-lg z-20`}>
        {config.icon}
      </div>
    );
  }

  return (
    <div className="absolute -top-1.5 -left-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-black text-gray-500 border-2 border-white z-20">
      #{rank}
    </div>
  );
}

// ─── Player Card ─────────────────────────────────────────────────────────

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const isTop3 = player.rank <= 3;
  const isYou = player.isYou;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`
        relative flex-shrink-0 flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all duration-200
        ${isYou ? "bg-[#FFD60A]/10 border-2 border-[#FFD60A]/30" : "bg-white"}
        ${isTop3 ? "w-[110px]" : "w-[100px]"}
      `}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Rank Badge */}
      <RankBadge rank={player.rank} />

      {/* Avatar */}
      <div className={`relative rounded-full overflow-hidden border-2 ${isYou ? "border-[#FFD60A]" : "border-gray-100"} w-14 h-14`}>
        <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
        
        {/* Online indicator */}
        {/* {player.isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
        )} */}
        
        {/* Streak fire */}
        {player.streak && player.streak > 2 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full flex items-center gap-0.5">
            <Flame size={8} className="fill-white" />
            {player.streak}
          </div>
        )}
      </div>

      {/* Username */}
      <p className={`mt-2 font-bold text-center truncate max-w-[90px] ${isYou ? "text-[#FFD60A]" : "text-gray-900"} ${isTop3 ? "text-[13px]" : "text-[12px]"}`}>
        {player.isYou ? "You" : player.username}
      </p>

      {/* Country */}
      {player.country && (
        <span className="text-[12px] mt-0.5">{player.country}</span>
      )}

      {/* Score */}
      <div className={`
        mt-2 flex items-center gap-1 px-2.5 py-1 rounded-full
        ${isTop3 ? "bg-[#7C3AED]/10" : "bg-gray-50"}
      `}>
        <Zap size={10} className={isTop3 ? "text-[#7C3AED]" : "text-gray-400"} />
        <span className={`text-[11px] font-black tabular-nums ${isTop3 ? "text-[#7C3AED]" : "text-gray-600"}`}>
          {player.score.toLocaleString()}
        </span>
      </div>

      {/* Win rate (top 3 only) */}
      {/* {isTop3 && player.winRate && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
          <TrendingUp size={10} />
          {player.winRate}% WR
        </div>
      )} */}

      {/* You badge */}
      {/* {isYou && (
        <span className="mt-2 text-[9px] font-black bg-[#FFD60A] text-[#0a0a0a] px-2 py-0.5 rounded-full uppercase tracking-wider">
          #{player.rank}
        </span>
      )} */}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function TopPlayersStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  // Separate top players from "you"
  const topPlayers = TOP_PLAYERS.filter(p => !p.isYou);
  const you = TOP_PLAYERS.find(p => p.isYou);

  return (
    <div className="w-full mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-black text-gray-900 leading-tight flex items-center gap-2">
            Top Players
            <span className="text-[14px]">🌍</span>
          </h2>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">Africa's finest this week</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canScrollLeft ? "bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${canScrollRight ? "bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Strip */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {topPlayers.map((player, i) => (
            <div key={player.id} className="snap-start">
              <PlayerCard player={player} index={i} />
            </div>
          ))}
          
          {/* "You" card at the end */}
          {you && (
            <div className="snap-start flex-shrink-0 flex flex-col items-center justify-center px-2">
              <PlayerCard player={you} index={topPlayers.length} />
            </div>
          )}
        </div>

        {/* Right edge fade */}
        <div
          className="absolute top-0 right-0 bottom-4 w-12 pointer-events-none transition-opacity"
          style={{
            background: "linear-gradient(to right, transparent, white)",
            opacity: canScrollRight ? 1 : 0,
          }}
        />
      </div>

      {/* Live indicator */}
      {/* <div className="flex items-center justify-center gap-2 mt-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-bold text-gray-400">
          {TOP_PLAYERS.filter(p => p.isOnline).length} players online now
        </span>
      </div> */}
    </div>
  );
}
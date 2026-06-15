"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface CasinoGame {
  id: string;
  name: string;
  image: string;
  tag?: string;
  players?: number;
  isNew?: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────

const CASINO_GAMES: CasinoGame[] = [
  {
    id: "1",
    name: "Blackjack",
    image: "https://images.unsplash.com/photo-1511193311914-0346f16af903?w=600&h=400&fit=crop",
    tag: "Most Popular",
    players: 1247,
    isNew: false,
  },
  {
    id: "2",
    name: "Roulette Elite",
    image: "https://images.unsplash.com/photo-1596832813101-1c3c5f8c1a1e?w=600&h=400&fit=crop",
    tag: "Live Dealer",
    players: 892,
    isNew: true,
  },
  {
    id: "3",
    name: "Poker Masters",
    image: "https://images.unsplash.com/photo-1544068150-682958bc3e6e?w=600&h=400&fit=crop",
    tag: "Tournament",
    players: 2341,
    isNew: false,
  },
  {
    id: "4",
    name: "Slots Vegas",
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=600&h=400&fit=crop",
    tag: "Jackpot",
    players: 5678,
    isNew: false,
  },
  {
    id: "5",
    name: "Baccarat Gold",
    image: "https://images.unsplash.com/photo-1596732157434-1a6d7c0d9b0e?w=600&h=400&fit=crop",
    tag: "VIP Only",
    players: 456,
    isNew: true,
  },
  {
    id: "6",
    name: "Craps Pro",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&h=400&fit=crop",
    tag: "High Stakes",
    players: 789,
    isNew: false,
  },
];

// ─── Single Card ─────────────────────────────────────────────────────────

function CasinoCard({ game, index }: { game: CasinoGame; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative flex-shrink-0 w-[300px] sm:w-[340px] h-[220px] rounded-[20px] overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image */}
      <img
        src={game.image}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
      />

      {/* Dark Gradient Overlay — Top to Bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Tag Badge */}
      {game.tag && (
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`
              inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full
              ${game.isNew ? "bg-[#FFD60A] text-[#0a0a0a]" : "bg-white/15 backdrop-blur-md text-white border border-white/20"}
            `}
          >
            {game.isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />}
            {game.tag}
          </span>
        </div>
      )}

      {/* Live Players */}
      {game.players && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold text-white/80 tabular-nums">
            {game.players.toLocaleString()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute flex justify-between bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="text-[22px] font-black text-white leading-tight mb-3 tracking-tight">
          {game.name}
        </h3>

        {/* <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 w-[fit-content] py-2 px-3 rounded-[10px] text-[13px] font-semibold tracking-wider"
          style={{
            background: "#7C3AED",
            color: "#fff",
            // boxShadow: "0 4px 0 #5B21B6, 0 8px 24px rgba(124,58,237,0.3)",
          }}
        >
          Play Now
        </motion.button> */}
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-300"
        style={{
          border: "2px solid rgba(124,58,237,0.3)",
          opacity: hovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
}

// ─── Main Carousel ───────────────────────────────────────────────────────

export default function CasinoGameCarousel() {
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
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900 leading-tight">Casino Games</h2>
          <p className="text-[12px] text-gray-500 font-medium mt-1">Play live with thousands of players</p>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${canScrollLeft
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }
            `}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${canScrollRight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }
            `}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CASINO_GAMES.map((game, i) => (
            <div key={game.id} className="snap-start">
              <CasinoCard game={game} index={i} />
            </div>
          ))}
        </div>

        {/* Fade edges */}
        {/* <div
          className="absolute top-0 right-0 bottom-4 w-16 pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, white)",
            opacity: canScrollRight ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        /> */}
      </div>
    </div>
  );
}
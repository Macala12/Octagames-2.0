"use client";

import { useNavigate } from "react-router-dom";
import {
  Trophy, Users, Clock, Zap, Star, Bell, Play,
  ChevronRight, ChevronLeft, TrendingUp, Shield,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import ActivityTicker from "../../components/tournament/Ticker";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT      = "#7C3AED";
const ACCENT_TEXT = "#fff";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tournament {
  id: string;
  title: string;
  image?: string;
  bg?: string;
  accentColor?: string;
  publisher?: string;
  publisherIcon?: string;
  tag?: string;
  prize: string;
  prizePool?: string;
  playersCount: number;
  maxPlayers?: number;
  minCoins: number;
  maxCoins: number;
  endTime: string;
  difficulty?: "easy" | "medium" | "hard";
  playerAvatars?: string[];
  topScore?: number;
  yourScore?: number;
  yourRank?: number;
  isJoined?: boolean;
  rating?: number;
  ratingCount?: number;
}

type TournamentType = "special" | "regular" | "exclusive";

const TYPE_MAP: Record<TournamentType, { label: string; emoji: string; textColor: string }> = {
  regular:   { label: "Regular",   emoji: "🎮", textColor: "#fff"    },
  special:   { label: "Special",   emoji: "⚡",  textColor: "#FFD60A" },
  exclusive: { label: "Exclusive", emoji: "👑", textColor: "#FFD60A" },
};

function TypePill({ type }: { type?: TournamentType }) {
  if (!type) return null;
  const { label, emoji, textColor } = TYPE_MAP[type];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wide px-2.5 py-1 rounded-full"
      style={{
        background: "#7C3AED",
        color: textColor,
        border: "0.5px solid rgba(255,255,255,0.2)",
      }}
    >
      <span>{emoji}</span>
      {label.toUpperCase()}
    </span>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountdown(endTime: string) {
  const [parts, setParts] = useState({ h: "00", m: "00", s: "00", ended: false, urgent: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) { setParts(p => ({ ...p, ended: true })); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setParts({
        ended:  false,
        urgent: h === 0 && m < 30,
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return parts;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function DifficultyPill({ level }: { level?: Tournament["difficulty"] }) {
  if (!level) return null;
  const map = {
    easy:   { label: "Easy",   color: "#09f2a6", bg: "rgba(9,242,166,0.18)"  },
    medium: { label: "Medium", color: "#FBBF24", bg: "rgba(251,191,36,0.18)" },
    hard:   { label: "Hard",   color: "#EF4444", bg: "rgba(239,68,68,0.18)"  },
  };
  const { label, color, bg } = map[level];
  return (
    <span className="text-[10px] font-extrabold tracking-wide px-2.5 py-1 rounded-full"
      style={{ background: bg, color, border: `0.5px solid ${color}40` }}>
      {label.toUpperCase()}
    </span>
  );
}

function StarRating({ rating, count }: { rating?: number; count?: number }) {
  if (!rating) return null;
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={11}
            className={i <= rounded ? "text-amber-400" : "text-white/20"}
            fill={i <= rounded ? "#FBBF24" : "transparent"} />
        ))}
      </div>
      {count && (
        <span className="text-[11px] font-semibold text-white/40">
          {count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count} rated
        </span>
      )}
    </div>
  );
}

function MiniProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className="w-full h-1 rounded-full overflow-hidden bg-white/10">
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function StatBox({
  label, value, sub, color, icon,
}: { label: string; value: React.ReactNode; sub?: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 12px",
               border: "0.5px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-1.5">
        {icon && <span style={{ color: color ?? "rgba(255,255,255,0.4)" }}>{icon}</span>}
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          {label}
        </p>
      </div>
      <p className="text-[16px] font-extrabold leading-none" style={{ color: color ?? "#fff" }}>
        {value}
      </p>
      {sub && <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
    </div>
  );
}

// ─── Single Card (unchanged UI) ───────────────────────────────────────────────
function SingleCard({
  t,
  onPlay,
}: {
  t: Tournament;
  onPlay?: (t: Tournament) => void;
}) {
  const navigate   = useNavigate();
  const timer      = useCountdown(t.endTime);
  const isFull     = !!(t.maxPlayers && t.playersCount >= t.maxPlayers);
  const fillPct    = t.maxPlayers ? Math.round((t.playersCount / t.maxPlayers) * 100) : null;
  const timerColor = timer.urgent ? "#EF4444" : ACCENT_TEXT;

  return (
    <div
      onClick={() => navigate("/tournament")}
      className="group w-full overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      style={{ background: "#0a0a0a", borderRadius: "8px" }}
    >

      {/* ── Hero image ── */}
      <div className="relative h-[200px] overflow-hidden">
        {t.image ? (
          <img src={t.image} alt={t.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full"
            style={{ background: t.bg ?? "linear-gradient(135deg,#1a0533,#7C3AED)" }} />
        )}

        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.8) 100%)" }} />

        {/* Top row: tag + difficulty + timer */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {t.tag && (
              <span className="text-[10px] font-extrabold tracking-wide px-2.5 py-1 rounded-full"
                style={{ background: ACCENT, color: ACCENT_TEXT }}>
                {t.tag.toUpperCase()}
              </span>
            )}
            <TypePill type="regular" />
          </div>

          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 flex-shrink-0"
            style={{
              background: timer.urgent ? "rgba(239,68,68,0.2)" : "rgba(0,0,0,0.45)",
              border:     `0.5px solid ${timer.urgent ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)"}`,
              backdropFilter: "blur(8px)",
            }}>
            <Clock size={11} style={{ color: timerColor, flexShrink: 0 }} />
            <span className="text-[12px] font-bold tabular-nums" style={{ color: timerColor }}>
              {timer.ended ? "Ended" : `${timer.h}:${timer.m}:${timer.s}`}
            </span>
          </div>
        </div>

        {/* Bottom overlay: prize + players */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,0.45)" }}>Prize Pool</p>
              <p className="text-[26px] font-extrabold text-white leading-none tracking-tight">
                {t.prizePool ?? t.prize}
              </p>
              {t.prizePool && (
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t.prize} per winner
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 mb-1"
              style={{ background: "rgba(0,0,0,0.45)", border: "0.5px solid rgba(255,255,255,0.12)",
                       backdropFilter: "blur(8px)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ animation: "pulse 2s ease-in-out infinite" }} />
              <Users size={11} className="text-white/60" />
              <span className="text-[11px] font-bold text-white tabular-nums">
                {t.playersCount.toLocaleString()}
                {t.maxPlayers && (
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>/{t.maxPlayers}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info body ── */}
      <div className="px-4 pt-4 pb-4 flex flex-col gap-4">

        {/* Title + publisher */}
        <div>
          <h3 className="text-[20px] font-extrabold text-white leading-tight mb-1.5">
            {t.title}
          </h3>
          <div className="flex items-center gap-2">
            {t.publisherIcon ? (
              <img src={t.publisherIcon} alt="" className="w-4 h-4 rounded object-contain" />
            ) : (
              <div className="w-4 h-4 rounded flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <Zap size={10} className="text-white/50" />
              </div>
            )}
            <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.publisher ?? "Octagames Studio"}
            </span>
            {t.rating && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <StarRating rating={t.rating} count={t.ratingCount} />
              </>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            label="Players"
            icon={<Users size={11} />}
            value={
              <span>
                {t.playersCount.toLocaleString()}
                {t.maxPlayers && (
                  <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                    /{t.maxPlayers}
                  </span>
                )}
              </span>
            }
            sub={fillPct !== null ? fillPct > 80 ? "Almost full!" : `${fillPct}% filled` : undefined}
            color={fillPct !== null && fillPct > 80 ? "#EF4444" : ACCENT_TEXT}
          />

          {t.yourScore ? (
            <StatBox
              label="Your Score"
              icon={<TrendingUp size={11} />}
              value={t.yourScore.toLocaleString()}
              sub={t.yourRank ? `Rank #${t.yourRank}${t.topScore ? ` · Top: ${t.topScore.toLocaleString()}` : ""}` : undefined}
              color={ACCENT_TEXT}
            />
          ) : t.topScore ? (
            <StatBox
              label="Top Score"
              icon={<Trophy size={11} />}
              value={t.topScore.toLocaleString()}
              color="#FBBF24"
            />
          ) : (
            <StatBox
              label="Status"
              icon={<Shield size={11} />}
              value="Open"
              sub="Be the first to play"
              color={ACCENT}
            />
          )}

          <StatBox
            label="Entry"
            value={
              <span>
                🪙 {t.minCoins.toLocaleString()}
                {t.maxCoins !== t.minCoins && (
                  <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                    –{t.maxCoins.toLocaleString()}
                  </span>
                )}
              </span>
            }
            color="rgba(255,255,255,0.85)"
          />

          <div className="flex flex-col gap-1"
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 12px",
                     border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              {t.yourScore && t.topScore ? "vs Top" : "Fill rate"}
            </p>
            <p className="text-[16px] font-extrabold leading-none text-white">
              {t.yourScore && t.topScore
                ? `${Math.round((t.yourScore / t.topScore) * 100)}%`
                : fillPct !== null ? `${fillPct}%` : "—"
              }
            </p>
            <MiniProgressBar
              value={t.yourScore && t.topScore ? t.yourScore : t.playersCount}
              max={t.yourScore && t.topScore ? t.topScore : (t.maxPlayers ?? t.playersCount)}
              color={t.yourScore && t.topScore ? ACCENT : fillPct !== null && fillPct > 80 ? "#EF4444" : ACCENT}
            />
          </div>
        </div>

        {/* Avatar stack */}
        {(t.playerAvatars ?? []).length > 0 && (
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {(t.playerAvatars ?? []).slice(0, 5).map((src, i) => (
                <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover"
                  style={{ border: "1.5px solid #0a0a0a", zIndex: 5 - i }} />
              ))}
            </div>
            <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.playersCount > 5 && `+${(t.playersCount - 5).toLocaleString()} more`} playing now
            </p>
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); onPlay?.(t); }}
          disabled={isFull && !t.isJoined}
          className="relative w-full flex items-center rounded-[7px] justify-center gap-2 py-3.5 text-[14px] font-extrabold overflow-hidden transition-all active:scale-[0.97]"
          style={
            t.isJoined
              ? { background: "rgba(9,242,166,0.12)", color: ACCENT, border: `1px solid rgba(9,242,166,0.35)` }
              : isFull
                ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "0.5px solid rgba(255,255,255,0.08)", cursor: "not-allowed" }
                : { background: ACCENT, color: ACCENT_TEXT, border: "none" }
          }
        >
          {!isFull && !t.isJoined && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
          )}
          {t.isJoined ? (
            <><Play size={16} fill={ACCENT} /><span>Resume Game</span><ChevronRight size={15} /></>
          ) : isFull ? (
            <><Bell size={16} /><span>Notify When Open</span></>
          ) : (
            <><Zap size={16} /><span>Enter Tournament</span><ChevronRight size={15} /></>
          )}
        </button>

      </div>
    </div>
  );
}

// ─── Main Carousel Wrapper ────────────────────────────────────────────────────
export default function TournamentCarousel({
  tournaments,
  onPlay,
}: {
  tournaments: Tournament[];
  onPlay?: (t: Tournament) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const total = tournaments.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [total]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setCurrentIndex(newIndex);
    }
  }, []);

  // Single tournament: no arrows needed
  if (total <= 1) {
    return (
      <div className="w-full">
        {tournaments[0] && <SingleCard t={tournaments[0]} onPlay={onPlay} />}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tournaments.map((t, i) => (
          <div
            key={t.id}
            className="w-full flex-shrink-0 snap-center"
          >
            <SingleCard t={t} onPlay={onPlay} />
          </div>
        ))}
      </div>

      {/* Navigation arrows - bottom right */}
      <div className="w-100 absolute -top-18 right-2 mt-3 px-1">
        <div className="flex justify-end w-100">

            <div className="flex justify-around gap-1.5">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5 mr-3">
                {tournaments.map((_, i) => (
                    <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                        width: i === currentIndex ? 20 : 6,
                        height: 6,
                        background: i === currentIndex ? ACCENT : "#000",
                    }}
                    />
                ))}
                </div>

                {/* Left arrow */}
                <button
                onClick={() => goTo(currentIndex - 1)}
                disabled={!canGoPrev}
                className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                    ${canGoPrev 
                    ? "bg-[#000] hover:bg-white/20 text-[#7C3AED] active:scale-95" 
                    : "bg-[#ccc] text-black/20 cursor-not-allowed"
                    }
                `}
                style={{ border: `0.5px solid ${canGoPrev ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}` }}
                >
                <ChevronLeft size={18} />
                </button>

                {/* Right arrow */}
                <button
                onClick={() => goTo(currentIndex + 1)}
                disabled={!canGoNext}
                className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                    ${canGoNext 
                    ? "bg-[#000] hover:bg-white/20 text-[#7C3AED] active:scale-95" 
                    : "bg-[#ccc] text-black/20 cursor-not-allowed"
                    }
                `}
                style={{ border: `0.5px solid ${canGoNext ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}` }}
                >
                <ChevronRight size={18} />
                </button>
            </div>

        </div>     
      </div>        
    </div>
  );
}
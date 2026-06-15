import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import {
  Briefcase, ShieldCheck, Gift, Wallet,
  ArrowRight, Sparkles, Users, Star,
} from "lucide-react";

/* ─── TYPES ────────────────────────────────────────────────── */

export interface DeckCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaSecondary?: string;
  gradient: string;
  accentColor: string;
  Icon: React.ElementType;
  stat?: { value: string; label: string };
  badge?: string;
}

interface Props {
  cards?: DeckCard[];
  autoPlay?: boolean;
  interval?: number;
}

/* ─── CARD DATA ─────────────────────────────────────────────── */

export const DEFAULT_PROMO_CARDS: DeckCard[] = [
  {
    id: "1",
    title: "Post a Task",
    subtitle: "Find skilled workers fast",
    description: "Describe your job, set a budget, and receive offers from verified workers.",
    cta: "Create Task",
    ctaSecondary: "See how it works",
    gradient: "linear-gradient(135deg, #059652 0%, #1dbf73 50%, #26d98a 100%)",
    accentColor: "#26d98a",
    Icon: Briefcase,
    stat: { value: "2,400+", label: "workers online" },
    badge: "Popular",
  },
  {
    id: "2",
    title: "Get Verified",
    subtitle: "Stand out from the crowd",
    description: "Verified workers earn 3× more. Complete identity checks to unlock premium jobs.",
    cta: "Verify Now",
    ctaSecondary: "Learn more",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)",
    accentColor: "#93c5fd",
    Icon: ShieldCheck,
    stat: { value: "3×", label: "more earnings" },
    badge: "Boost earnings",
  },
  {
    id: "3",
    title: "Invite & Earn",
    subtitle: "Share, refer, reward",
    description: "Earn ₦2,500 for every friend who completes their first task on Taskly.",
    cta: "Invite Friends",
    ctaSecondary: "View rewards",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
    accentColor: "#c4b5fd",
    Icon: Gift,
    stat: { value: "₦2,500", label: "per referral" },
    badge: "Limited time",
  },
  {
    id: "4",
    title: "Fund Wallet",
    subtitle: "Instant escrow protection",
    description: "Pay with confidence. Funds held in escrow until work is approved.",
    cta: "Top Up Now",
    ctaSecondary: "How escrow works",
    gradient: "linear-gradient(135deg, #c2410c 0%, #f97316 50%, #fb923c 100%)",
    accentColor: "#fdba74",
    Icon: Wallet,
    stat: { value: "100%", label: "secure payments" },
    badge: "Recommended",
  },
];

/* ─── STACK OFFSETS ─────────────────────────────────────────── */

const STACK_OFFSETS = [
  { x: 0,   y: 0,  rotate: 0,  scale: 1    },
  { x: -10, y: 14, rotate: -2, scale: 0.97 },
  { x: 10,  y: 28, rotate: 2,  scale: 0.94 },
  { x: -6,  y: 42, rotate: -1, scale: 0.91 },
];

/* ─── MAIN COMPONENT ────────────────────────────────────────── */

export default function CardDeckCarousel({
  cards = DEFAULT_PROMO_CARDS,
  autoPlay = true,
  interval = 5500,
}: Props) {
  const [active, setActive]       = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragDir, setDragDir]     = useState<"up" | "down" | null>(null);
  const [isPaused, setIsPaused]   = useState(false);
  const progressRef               = useRef<ReturnType<typeof setTimeout>>();

  const nextCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDragDir("up");
    setTimeout(() => {
      setActive((prev) => (prev + 1) % cards.length);
      setIsAnimating(false);
      setDragDir(null);
    }, 380);
  }, [isAnimating, cards.length]);

  const prevCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDragDir("down");
    setTimeout(() => {
      setActive((prev) => (prev - 1 + cards.length) % cards.length);
      setIsAnimating(false);
      setDragDir(null);
    }, 380);
  }, [isAnimating, cards.length]);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(nextCard, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextCard, isPaused]);

  const visibleCards = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => cards[(active + i) % cards.length]);
  }, [active, cards]);

  return (
    <div
      className="mt-10 relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Card stack — constrained z-index so it never overlaps navbar */}
      <div className="relative w-full h-[220px] z-0">

        {/* Back cards */}
        {visibleCards.slice(1).reverse().map((card, reverseIdx) => {
          const stackIdx = visibleCards.length - reverseIdx - 1;
          const offset   = STACK_OFFSETS[Math.min(stackIdx, STACK_OFFSETS.length - 1)];

          return (
            <motion.div
              key={`stack-${card.id}-${stackIdx}`}
              animate={{ x: offset.x, y: offset.y, rotate: offset.rotate, scale: offset.scale }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
              style={{ zIndex: 10 - stackIdx }}
            >
              <PromoCard card={card} depth={stackIdx} />
            </motion.div>
          );
        })}

        {/* Active (top) card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={visibleCards[0].id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info: PanInfo) => {
              if (info.offset.y < -80 && !isAnimating) nextCard();
              if (info.offset.y > 80  && !isAnimating) prevCard();
            }}
            initial={{ y: dragDir === "down" ? -60 : 60, opacity: 0, rotate: dragDir === "down" ? 4 : -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{
              y: dragDir === "down" ? 60 : -420,
              opacity: 0,
              rotate: dragDir === "down" ? -6 : 6,
              transition: { duration: 0.38, ease: "easeIn" },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ zIndex: 20 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <PromoCard card={visibleCards[0]} depth={0} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-14">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => !isAnimating && setActive(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active ? "w-5 h-1.5 bg-[#1dbf73]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Swipe hint — fades after first hover */}
      <p className="text-center text-[11px] text-gray-400 mt-2">
        Swipe up · Auto-advances
      </p>
    </div>
  );
}

/* ─── PROMO CARD ─────────────────────────────────────────────── */

function PromoCard({ card, depth }: { card: DeckCard; depth: number }) {
  const { Icon } = card;

  const shadows = [
    "0 20px 50px rgba(0,0,0,0.18)",
    "0 14px 32px rgba(0,0,0,0.13)",
    "0 8px 20px rgba(0,0,0,0.09)",
    "0 4px 12px rgba(0,0,0,0.06)",
  ];

  const isTop = depth === 0;

  return (
    <div
      className="relative w-full h-[220px] rounded-[28px] overflow-hidden border border-white/10"
      style={{
        background: card.gradient,
        boxShadow: shadows[Math.min(depth, shadows.length - 1)],
        opacity: isTop ? 1 : 0.85 - depth * 0.05,
      }}
    >
      {/* Dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orb top-right */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-25 blur-2xl"
        style={{ background: card.accentColor }}
      />

      {/* Content */}
      {isTop ? (
        <div className="relative z-10 h-full flex flex-col justify-between px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              {/* Badge */}
              {card.badge && (
                <div className="inline-flex items-center gap-1 bg-white/20 border border-white/20 rounded-full px-2.5 py-0.5 mb-2.5">
                  <Sparkles size={10} className="text-white" />
                  <span className="text-[10.5px] font-medium text-white">{card.badge}</span>
                </div>
              )}
              <h2 className="text-[22px] font-semibold text-white leading-tight">{card.title}</h2>
              <p className="text-white/60 text-[11.5px] font-medium mt-0.5">{card.subtitle}</p>
            </div>

            {/* Icon tile + stat */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Icon size={20} className="text-white" />
              </div>
              {card.stat && (
                <div className="text-center">
                  <p className="text-[15px] font-bold text-white leading-none">{card.stat.value}</p>
                  <p className="text-[9.5px] text-white/55 leading-tight">{card.stat.label}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-white/75 text-[12.5px] leading-relaxed mb-4 max-w-[68%]">
              {card.description}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-white text-gray-900 font-semibold text-[12.5px] px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                {card.cta}
                <ArrowRight size={13} />
              </button>
              {card.ctaSecondary && (
                <button className="text-white/65 hover:text-white text-[12px] font-medium transition-colors">
                  {card.ctaSecondary}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Simplified back-card — just show title so rendering is cheap */
        <div className="relative z-10 h-full flex items-center px-6">
          <p className="text-[18px] font-semibold text-white/50">{card.title}</p>
        </div>
      )}
    </div>
  );
}
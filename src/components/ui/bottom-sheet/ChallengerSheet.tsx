import { useState, useMemo } from "react";

export interface Tier {
  id: string;
  label: string;
  emoji: string;
  scoreRange: string;
  multiplier: number;
  accent: string;
  border: string;
}

export interface ChallengeDetailData {
  gameTitle: string;
  description?: string;
  image?: string;
  players: number;
  tiers: Tier[];
  reward: number;
}

interface Props {
  data: ChallengeDetailData;
  balance?: number;
  onBack?: () => void;
  onPlay?: (payload: { wager: number; tiers: { tierId: string; potentialWin: number }[] }) => void;
}

const RAKE = 0.05;
const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

const DEFAULT_TIERS: Tier[] = [
  { id: "bronze", label: "Bronze", emoji: "🥉", scoreRange: "100–499", multiplier: 1.5, accent: "rgb(205, 128, 50)", border: "rgba(205,127,50,0.25)" },
  { id: "silver", label: "Silver", emoji: "🥈", scoreRange: "500–999", multiplier: 2,   accent: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" },
  { id: "gold",   label: "Gold",   emoji: "🥇", scoreRange: "1000+",   multiplier: 3,   accent: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)" },
];

function calcWin(wager: number, multiplier: number) {
  return Math.floor(wager * multiplier * (1 - RAKE));
}

function formatPlayers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}

// Tier card — shows auto-calculated win when wager is entered
function TierCard({ tier, wager, valid }: { tier: Tier; wager: number; valid: boolean }) {
  const win = valid && wager > 0 ? calcWin(wager, tier.multiplier) : null;

  return (
    <div
      className="rounded-2xl p-3 text-center transition-all bg-black"
    >
      <div className="text-[22px] mb-1">{tier.emoji}</div>
      <div className="text-[12px] font-extrabold text-gray-900 dark:text-white mb-1.5">
        {tier.label}
      </div>

      {/* Multiplier pill */}
      <div className="inline-block rounded-full px-2.5 py-0.5 mb-2"
        style={{ background: ACCENT }}>
        <span className="text-[11px] font-extrabold" style={{ color: ACCENT_TEXT }}>
          x{tier.multiplier}
        </span>
      </div>

      <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Score</div>
      <div className="text-[11px] font-semibold text-gray-500 dark:text-white/50 mb-2">
        {tier.scoreRange}
      </div>

      {/* Auto win display — shown when wager is entered */}
      <div className="border-t border-gray-100 dark:border-white/8 pt-2 mt-1">
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          You win
        </div>
        <div
          className="text-[13px] font-extrabold transition-all"
          style={{ color: win ? ACCENT : "var(--color-text-tertiary)" }}
        >
          {win ? `${win.toLocaleString()} 🪙` : "—"}
        </div>
      </div>
    </div>
  );
}

export default function ChallengeDetail({ data, balance = 350, onPlay }: Props) {
  const tiers = data.tiers?.length ? data.tiers : DEFAULT_TIERS;
  const [wagerStr, setWagerStr] = useState("");

  const wager       = parseInt(wagerStr) || 0;
  const insufficient = wager > balance;
  const hasWager    = wager > 0;
  const valid       = hasWager && !insufficient;

  const ctaState = useMemo(() => {
    if (!hasWager)    return "empty";
    if (insufficient) return "insufficient";
    return "ready";
  }, [hasWager, insufficient]);

  const handlePlay = () => {
    if (ctaState !== "ready") return;
    onPlay?.({
      wager,
      tiers: tiers.map(t => ({ tierId: t.id, potentialWin: calcWin(wager, t.multiplier) })),
    });
  };

  return (
    <div className=" dark: overflow-hidden">

      {/* Hero */}
      <div className="relative rounded-[20px] h-[220px] overflow-hidden bg-[#0a0a0a]">
        {data.image ? (
          <img src={data.image} alt={data.gameTitle} className="w-full h-full object-cover" />
        ) : (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 220"
            preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="cdots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="390" height="220" fill="url(#cdots)" />
            <ellipse cx="320" cy="40"  rx="150" ry="110" fill="#09f2a6" opacity="0.06" />
            <ellipse cx="60"  cy="190" rx="110" ry="80"  fill="#7C3AED" opacity="0.1"  />
            <circle cx="320" cy="220" r="120" fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.12" />
            <circle cx="320" cy="220" r="82"  fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.09" />
          </svg>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

        {/* Players */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
          style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-[11px] font-bold text-white">{formatPlayers(data.players)} playing</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-[24px] font-extrabold text-white tracking-tight">{data.gameTitle}</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{data.description}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-5 pb-8 flex flex-col gap-5">

        {/* Wager input — ABOVE tiers so wins update as you type */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-extrabold text-gray-900 dark:text-white">Enter Wager</p>
            <p className="text-[11px] transition-colors"
              style={{ color: insufficient ? "#EF4444" : valid ? ACCENT : "var(--color-text-tertiary)" }}>
              {insufficient ? "Insufficient balance"
                : valid      ? "Wins updated ✓"
                :              "Type to see wins per tier"}
            </p>
          </div>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="How many coins to wager?"
              value={wagerStr}
              min={1}
              max={balance}
              onChange={e => setWagerStr(e.target.value)}
              className="w-full px-4 pr-12 py-3.5 rounded-2xl text-[16px] font-bold outline-none transition-all
                bg-gray-50 dark:bg-white/5
                border border-gray-200 dark:border-white/8
                text-gray-900 dark:text-white
                placeholder:text-gray-300 dark:placeholder:text-white/20
                focus:border-[#09f2a6]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🪙</span>
          </div>
          {insufficient && (
            <p className="text-[11px] text-red-400 mt-1.5">
              Max {balance.toLocaleString()} coins — you need {(wager - balance).toLocaleString()} more
            </p>
          )}
        </div>

        {/* Tier cards — auto-calculate wins */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-extrabold text-gray-900 dark:text-white">Win Tiers</p>
            <p className="text-[11px] text-gray-400">Based on your in-game score</p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {tiers.map(tier => (
              <TierCard key={tier.id} tier={tier} wager={wager} valid={valid} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={handlePlay}
            disabled={ctaState !== "ready"}
            className="w-full py-4 rounded-2xl text-[14px] font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
            style={
              ctaState === "ready"        ? { background: ACCENT, color: ACCENT_TEXT } :
              ctaState === "insufficient" ? { background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "not-allowed" } :
                                           { background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", cursor: "not-allowed" }
            }>
            {ctaState === "empty"        ? "Enter a wager to continue"
             : ctaState === "insufficient" ? `Need ${(wager - balance).toLocaleString()} more coins`
             :                               "Start Challenge"}
          </button>

          {ctaState === "ready" && (
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Win amount depends on your final in-game score
            </p>
          )}
          {ctaState === "insufficient" && (
            <p className="text-center text-[11px] text-red-400 mt-2">
              Top up your coins to continue
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
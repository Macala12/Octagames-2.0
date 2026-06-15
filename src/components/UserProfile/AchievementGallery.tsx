import { useState } from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import { JSX } from "react/jsx-runtime";

// Rank order for sorting: higher rankLevel = greater achievement
const RANK_LEVELS = {
  beginner: 1,
  amateur: 2,
  intermediate: 3,
  pro: 4,
  elite: 5,
  legend: 6,
};

const RANK_STYLES = {
  beginner:     { label: "Beginner",     bg: "#F1EFE8", color: "#888780" },
  amateur:      { label: "Amateur",      bg: "#E6F1FB", color: "#185FA5" },
  intermediate: { label: "Intermediate", bg: "#E1F5EE", color: "#0F6E56" },
  pro:          { label: "Pro",          bg: "#EEEDFE", color: "#3C3489" },
  elite:        { label: "Elite",        bg: "#FAEEDA", color: "#854F0B" },
  legend:       { label: "Legend",       bg: "#FCEBEB", color: "#A32D2D" },
};

const ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Blood",
    desc: "Win your first game",
    state: "unlocked",
    rank: "beginner",
    color: "#E24B4A",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#FCEBEB" strokeWidth="2.5" />
        <path d="M28 14C28 14 20 22 20 30C20 36.627 23.582 41 28 41C32.418 41 36 36.627 36 30C36 22 28 14 28 14Z" fill="#E24B4A" stroke="#A32D2D" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="24" cy="27" rx="3" ry="4.5" fill="#F09595" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Hat Trick",
    desc: "Win 3 games in a row",
    state: "unlocked",
    rank: "amateur",
    color: "#378ADD",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#E6F1FB" strokeWidth="2.5" />
        <rect x="16" y="34" width="24" height="4" rx="2" fill="#378ADD" stroke="#185FA5" strokeWidth="1.2" />
        <path d="M20 34L22 20L28 17L34 20L36 34Z" fill="#378ADD" stroke="#185FA5" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="24" y="34" width="8" height="6" rx="1.5" fill="#185FA5" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Century",
    desc: "Play 100 games",
    state: "inprogress",
    rank: "intermediate",
    color: "#BA7517",
    pct: 67,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#FAEEDA" strokeWidth="2.5" strokeDasharray="5 3" />
        <text x="28" y="33" textAnchor="middle" fontSize="18" fontWeight="700" fill="#BA7517" fontFamily="system-ui">100</text>
      </svg>
    ),
  },
  {
    id: 4,
    name: "Sharpshooter",
    desc: "Hit 90% accuracy",
    state: "unlocked",
    rank: "pro",
    color: "#1D9E75",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#E1F5EE" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="14" fill="none" stroke="#1D9E75" strokeWidth="2" />
        <circle cx="28" cy="28" r="8" fill="none" stroke="#1D9E75" strokeWidth="2" />
        <circle cx="28" cy="28" r="3.5" fill="#1D9E75" />
        <line x1="28" y1="14" x2="28" y2="18" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="38" x2="28" y2="42" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="28" x2="18" y2="28" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="28" x2="42" y2="28" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 5,
    name: "Night Owl",
    desc: "Play after midnight",
    state: "unlocked",
    rank: "beginner",
    color: "#534AB7",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#EEEDFE" stroke="#7F77DD" strokeWidth="2.5" />
        <path d="M36 28.5A10 10 0 0 1 22 18.5A10 10 0 0 0 36 36.5A10 10 0 0 1 36 28.5Z" fill="#534AB7" stroke="#3C3489" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="38" cy="20" r="2" fill="#AFA9EC" />
        <circle cx="34" cy="15" r="1.5" fill="#AFA9EC" />
        <circle cx="42" cy="26" r="1" fill="#AFA9EC" />
      </svg>
    ),
  },
  {
    id: 6,
    name: "On Fire",
    desc: "5 wins without a loss",
    state: "inprogress",
    rank: "amateur",
    color: "#D85A30",
    pct: 40,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#FAECE7" stroke="#F0997B" strokeWidth="2.5" strokeDasharray="5 3" />
        <path d="M28 40C28 40 20 35 20 28C20 24 23 20 26 18C25 22 28 23 28 23C28 23 26 19 31 16C31 20 34 22 34 26C34 30 32 33 28 40Z" fill="#D85A30" stroke="#993C1D" strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="26" cy="30" rx="2.5" ry="3.5" fill="#F0997B" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 7,
    name: "Social Butterfly",
    desc: "Play with 10 friends",
    state: "unlocked",
    rank: "amateur",
    color: "#D4537E",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#FBEAF0" stroke="#ED93B1" strokeWidth="2.5" />
        <circle cx="28" cy="22" r="5" fill="#D4537E" stroke="#993556" strokeWidth="1.5" />
        <path d="M18 38C18 33.582 22.477 30 28 30C33.523 30 38 33.582 38 38" stroke="#D4537E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="18" cy="24" r="3.5" fill="#ED93B1" stroke="#D4537E" strokeWidth="1.2" />
        <circle cx="38" cy="24" r="3.5" fill="#ED93B1" stroke="#D4537E" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 8,
    name: "The Grind",
    desc: "Play 7 days straight",
    state: "inprogress",
    rank: "intermediate",
    color: "#888780",
    pct: 57,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="2.5" strokeDasharray="5 3" />
        <rect x="16" y="16" width="24" height="24" rx="4" fill="none" stroke="#888780" strokeWidth="2" />
        <line x1="16" y1="22" x2="40" y2="22" stroke="#888780" strokeWidth="1.5" />
        <line x1="23" y1="13" x2="23" y2="19" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
        <line x1="33" y1="13" x2="33" y2="19" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
        <rect x="20" y="26" width="5" height="4" rx="1" fill="#888780" />
        <rect x="27" y="26" width="5" height="4" rx="1" fill="#B4B2A9" />
        <rect x="20" y="32" width="5" height="4" rx="1" fill="#B4B2A9" />
      </svg>
    ),
  },
  {
    id: 9,
    name: "Gold Rush",
    desc: "Earn $1,000 in prizes",
    state: "unlocked",
    rank: "pro",
    color: "#BA7517",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2.5" />
        <polygon points="28,13 31.5,23 42,23 33.5,29.5 36.5,40 28,33.5 19.5,40 22.5,29.5 14,23 24.5,23" fill="#EF9F27" stroke="#BA7517" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 10,
    name: "Comeback Kid",
    desc: "Win after being down",
    state: "unlocked",
    rank: "intermediate",
    color: "#1D9E75",
    pct: 100,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2.5" />
        <polyline points="15,36 22,26 28,32 35,20 42,20" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="37,16 42,20 38,25" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 11,
    name: "Speed Demon",
    desc: "Finish a game in under 1 min",
    state: "locked",
    rank: "pro",
    color: "#888780",
    pct: 0,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="2" />
        <circle cx="28" cy="30" r="11" fill="none" stroke="#D3D1C7" strokeWidth="2" />
        <line x1="28" y1="30" x2="28" y2="22" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="30" x2="34" y2="27" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="17" x2="32" y2="17" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 12,
    name: "Iron Wall",
    desc: "Lose 0 rounds in a match",
    state: "locked",
    rank: "elite",
    color: "#888780",
    pct: 0,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="2" />
        <path d="M28 14L38 19V28C38 34 33 39 28 41C23 39 18 34 18 28V19Z" fill="none" stroke="#D3D1C7" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 13,
    name: "King of the Hill",
    desc: "Hold #1 rank for a week",
    state: "locked",
    rank: "elite",
    color: "#888780",
    pct: 0,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="2" />
        <path d="M16 36L20 22L28 28L36 22L40 36Z" fill="none" stroke="#D3D1C7" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="20" cy="22" r="2.5" fill="#D3D1C7" />
        <circle cx="28" cy="28" r="2.5" fill="#D3D1C7" />
        <circle cx="36" cy="22" r="2.5" fill="#D3D1C7" />
        <path d="M26 15L28 12L30 15" fill="#D3D1C7" />
      </svg>
    ),
  },
  {
    id: 14,
    name: "Marathoner",
    desc: "Play for 10 hours total",
    state: "locked",
    rank: "intermediate",
    color: "#888780",
    pct: 0,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="2" />
        <circle cx="28" cy="28" r="11" fill="none" stroke="#D3D1C7" strokeWidth="2" />
        <circle cx="28" cy="28" r="2" fill="#D3D1C7" />
        <line x1="28" y1="28" x2="28" y2="19" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="28" x2="34" y2="32" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 15,
    name: "Legend",
    desc: "Reach 1,000 total wins",
    state: "locked",
    rank: "legend",
    color: "#888780",
    pct: 0,
    badge: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="#F1EFE8" stroke="#D3D1C7" strokeWidth="2" />
        <rect x="20" y="28" width="16" height="12" rx="2" fill="none" stroke="#D3D1C7" strokeWidth="2" />
        <path d="M22 28V24C22 20.686 24.686 18 28 18C31.314 18 34 20.686 34 24V28" fill="none" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="34" r="2" fill="#D3D1C7" />
      </svg>
    ),
  },
];

// Sort completed first, then inprogress, then locked
function sortByState(list: { id: number; name: string; desc: string; state: string; rank: string; color: string; pct: number; badge: JSX.Element; }[]) {
  const order = { unlocked: 0, inprogress: 1, locked: 2 };
  return [...list].sort((a, b) => order[a.state as keyof typeof order] - order[b.state as keyof typeof order]);
}

function applySort(list: any[], sortKey: string) {
  switch (sortKey) {
    case "rank-asc":
      return [...list].sort((a, b) => RANK_LEVELS[a.rank as keyof typeof RANK_LEVELS] - RANK_LEVELS[b.rank as keyof typeof RANK_LEVELS]);
    case "rank-desc":
      return [...list].sort((a, b) => RANK_LEVELS[b.rank as keyof typeof RANK_LEVELS] - RANK_LEVELS[a.rank as keyof typeof RANK_LEVELS]);
    case "unlocked":
      return list.filter((a: { state: string; }) => a.state === "unlocked");
    case "inprogress":
      return list.filter((a: { state: string; }) => a.state === "inprogress");
    case "locked":
      return list.filter((a: { state: string; }) => a.state === "locked");
    default:
      return list;
  }
}

function RankPill({ rank }: { rank: string }) {
  const style = RANK_STYLES[rank as keyof typeof RANK_STYLES];
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        padding: "2px 7px",
        borderRadius: 99,
        background: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
}

function BadgeIcon({ achievement }: { achievement: { id: number; name: string; desc: string; state: string; rank: string; color: string; pct: number; badge: JSX.Element; } }) {
  const isLocked = achievement.state === "locked";
  return (
    <div
      style={{
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: isLocked ? "grayscale(1) opacity(0.3)" : "none",
        transition: "filter 0.2s",
      }}
    >
      {achievement.badge}
    </div>
  );
}

function StateLabel({ achievement }: { achievement: { id: number; name: string; desc: string; state: string; rank: string; color: string; pct: number; badge: JSX.Element; } }) {
  const { state, color, pct } = achievement;

  if (state === "unlocked") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" fill={color} opacity="0.15" />
          <path d="M3.5 6L5.2 7.8L8.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>Unlocked</span>
      </div>
    );
  }

  if (state === "inprogress") {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ width: "100%", height: 5, background: "#F1EFE8", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: color,
              borderRadius: 99,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <span style={{ fontSize: 10, color: "#888780", fontWeight: 500 }}>{pct}%</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
        <rect x="1" y="5" width="8" height="7" rx="1.5" stroke="#B4B2A9" strokeWidth="1.3" />
        <path d="M3 5V3.5C3 2.119 3.895 1 5 1C6.105 1 7 2.119 7 3.5V5" stroke="#B4B2A9" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 10, color: "#B4B2A9", fontWeight: 500 }}>Locked</span>
    </div>
  );
}

function AchievementCard({ achievement, compact = false }: { achievement: { id: number; name: string; desc: string; state: string; rank: string; color: string; pct: number; badge: JSX.Element; }; compact?: boolean }) {
  const isLocked = achievement.state === "locked";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: compact ? "14px 8px 12px" : "18px 10px 14px",
        borderRadius: 14,
        textAlign: "center",
        cursor: isLocked ? "default" : "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#F8F7F5"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <BadgeIcon achievement={achievement} />
      <div style={{ margin: "6px 0 2px" }}>
        <RankPill rank={achievement.rank} />
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: isLocked ? "#B4B2A9" : "#1A1A1A", margin: "6px 0 2px", lineHeight: 1.3 }}>
        {achievement.name}
      </p>
      <p style={{ fontSize: 10, color: isLocked ? "#D3D1C7" : "#888780", margin: "0 0 8px", lineHeight: 1.4 }}>
        {achievement.desc}
      </p>
      <StateLabel achievement={achievement} />
    </div>
  );
}

// ─── Bottom Sheet Content ───────────────────────────────────────────────────
function AchievementSheetContent() {
  const [sortKey, setSortKey] = useState("default");

  const base = sortByState(ACHIEVEMENTS);
  const displayed = applySort(base, sortKey);

  return (
    <div>
      {/* Sort row */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#1A1A1A",
            background: "#F8F7F5",
            border: "1px solid #E8E6E0",
            borderRadius: 8,
            padding: "6px 28px 6px 10px",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888780' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="default">Sort: Default</option>
          <option value="rank-desc">Rank: Highest first</option>
          <option value="rank-asc">Rank: Lowest first</option>
          <option value="unlocked">Unlocked only</option>
          <option value="inprogress">In progress only</option>
          <option value="locked">Locked only</option>
        </select>
      </div>

      {/* Full grid in sheet */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "4px 6px",
        }}
      >
        {displayed.map((a) => (
          <AchievementCard key={a.id} achievement={a} compact />
        ))}
      </div>

      {displayed.length === 0 && (
        <p style={{ textAlign: "center", color: "#B4B2A9", fontSize: 13, marginTop: 32 }}>
          No achievements match this filter.
        </p>
      )}
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────
export default function AchievementGallery() {
  const [sheetOpen, setSheetOpen] = useState(false);

  // const unlocked = ACHIEVEMENTS.filter((a) => a.state === "unlocked").length;
  const total = ACHIEVEMENTS.length;
  // const pctOverall = Math.round((unlocked / total) * 100);

  // Show first 3 sorted (completed first)
  const preview = sortByState(ACHIEVEMENTS).slice(0, 4);

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "",
        marginTop: "20px",
        marginBottom: "20px"
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        {/* <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            Achievements
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 13, color: "#888780", fontWeight: 500 }}>
              {unlocked} of {total} unlocked
            </span>
            <div style={{ flex: 1, maxWidth: 160, height: 5, background: "#F1EFE8", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${pctOverall}%`, height: "100%", background: "#1A1A1A", borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, color: "#B4B2A9", fontWeight: 500 }}>{pctOverall}%</span>
          </div>
        </div> */}

        {/* Preview grid — 4 cols on mobile, auto on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "4px 8px",
          }}
          className="achievement-preview-grid"
        >
          {preview.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>

        {/* See more CTA */}
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 4px",
              fontSize: 13,
              fontWeight: 600,
              color: "#888780",
              cursor: "pointer",
              letterSpacing: "0.1px",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              textDecorationColor: "#D3D1C7",
              transition: "color 0.15s",
            }}
            // onMouseEnter={(e) => { e.target.style.color = "#1A1A1A"; }}
            // onMouseLeave={(e) => { e.target.style.color = "#888780"; }}
          >
            See all {total} achievements
          </button>
        </div>
      </div>

      {/* Responsive style for 4-col mobile grid */}
      <style>{`
        @media (max-width: 640px) {
          .achievement-preview-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

      {/* Bottom Sheet */}
      <BottomSheet
        title="All Achievements"
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        background="#ffffff"
      >
        <AchievementSheetContent />
      </BottomSheet>
    </div>
  );
}
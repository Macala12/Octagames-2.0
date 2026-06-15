// ─── Notification Screen ───────────────────────────────────────────────────
import React, { useState } from "react";

interface NotifAction { label: string; primary: boolean; }

interface Notif {
  id: number;
  unread: boolean;
  type: "game" | "reward" | "social";
  avatar?: string;
  initials?: string;
  avatarColor?: string;
  icon?: string;
  iconBg?: string;
  iconBorder?: string;
  title: string;
  body: string;        // plain text — bold handled via spans
  boldInBody?: string; // the part to bold
  meta: string;
  time: string;
  actions: NotifAction[];
}

const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

type Filter = "all" | "unread" | "game" | "reward";

const mockNotifs: Notif[] = [
  {
    id: 1, unread: true, type: "game",
    avatar: "https://i.pravatar.cc/100?img=1", initials: "JK", avatarColor: "#7C3AED",
    title: "Jocelyn Kenter", body: "challenged you to a match in Dart Master 🎯",
    meta: "Game", time: "2 min ago",
    actions: [{ label: "Accept", primary: true }, { label: "Decline", primary: false }],
  },
  {
    id: 2, unread: true, type: "reward",
    icon: "🏆", iconBg: "rgba(251,191,36,0.1)", iconBorder: "rgba(251,191,36,0.2)",
    title: "Tournament Reward",
    body: "You won ₦5,000 in the Weekend Warriors tournament! Claim your prize.",
    meta: "Reward", time: "15 min ago",
    actions: [{ label: "Claim", primary: true }],
  },
  {
    id: 3, unread: false, type: "game",
    avatar: "https://i.pravatar.cc/100?img=3", initials: "TB", avatarColor: "#0369A1",
    title: "Tunde Bello", body: "beat your high score in Snake Rush. Challenge them back?",
    meta: "Game", time: "1 hr ago",
    actions: [{ label: "Rematch", primary: true }],
  },
  {
    id: 4, unread: false, type: "reward",
    icon: "🪙", iconBg: "rgba(9,242,166,0.1)", iconBorder: "rgba(9,242,166,0.2)",
    title: "Referral Bonus",
    body: "Your friend Adaeze joined using your code. You earned ₦300!",
    meta: "Reward", time: "3 hr ago",
    actions: [],
  },
  {
    id: 5, unread: false, type: "social",
    avatar: "https://i.pravatar.cc/100?img=5", initials: "AO", avatarColor: "#9D174D",
    title: "Adaeze Obi", body: "sent you a friend request.",
    meta: "Social", time: "Yesterday",
    actions: [{ label: "Accept", primary: true }, { label: "Ignore", primary: false }],
  },
];

function NotifAvatar({ n }: { n: Notif }) {
  const [err, setErr] = useState(false);
  if (n.icon) {
    return (
      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: n.iconBg, border: `0.5px solid ${n.iconBorder}` }}>
        {n.icon}
      </div>
    );
  }
  return (
    <div className="relative flex-shrink-0">
      {err ? (
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white"
          style={{ background: n.avatarColor }}>
          {n.initials}
        </div>
      ) : (
        <img src={n.avatar} alt={n.title} onError={() => setErr(true)}
          className="w-11 h-11 rounded-full object-cover block"
          style={{ border: `1.5px solid ${n.unread ? ACCENT : "var(--color-border-tertiary)"}` }} />
      )}
    </div>
  );
}

export default function Notification() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = mockNotifs.filter(n => {
    if (filter === "unread") return n.unread;
    if (filter === "game")   return n.type === "game";
    if (filter === "reward") return n.type === "reward";
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all",    label: "All"     },
    { id: "unread", label: "Unread"  },
    { id: "game",   label: "Game"    },
    { id: "reward", label: "Rewards" },
  ];

  const pillStyle = (f: Filter): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: 99,
    fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
    background: filter === f ? ACCENT : "transparent",
    color:      filter === f ? ACCENT_TEXT : "var(--color-text-secondary)",
    border:     filter === f ? "none" : "0.5px solid var(--color-border-tertiary)",
    transition: "all 0.2s",
  } as React.CSSProperties);

  return (
    <div className="p-4 mt-3 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center
            bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
            active:scale-90 transition-transform">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className="text-gray-500 dark:text-white/50">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            </button>
            <div>
                <h1 className="text-[16px] font-extrabold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-[12px] text-gray-400 mt-0.5">You have <b className="text-brand-500">5</b> new notifications</p>
            </div>
            
        </div>
        <button className="text-[12px] font-bold" style={{ color: ACCENT }}>
          Mark all read
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={pillStyle(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-[13px] text-gray-400">No notifications</div>
      ) : (
        <ul className="flex flex-col">
          {filtered.map((n, i) => (
            <li key={n.id}
              className="flex items-start gap-3 py-3.5 border-b border-gray-100 dark:border-white/[0.06] last:border-0"
              style={{
                background: n.unread ? "rgba(9,242,166,0.02)" : "transparent",
                animation: `fadeUp 0.3s ease ${i * 60}ms both`,
              }}>
              <NotifAvatar n={n} />

              <div className="flex-1 min-w-0">
                {/* Body text */}
                <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300 mb-1.5">
                  <span className="font-bold text-gray-900 dark:text-white">{n.title} </span>
                  {n.body}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400">{n.meta}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20 inline-block" />
                  <span className="text-[11px] text-gray-400">{n.time}</span>
                </div>

                {/* Actions */}
                {n.actions.length > 0 && (
                  <div className="flex gap-1.5 mt-2.5">
                    {n.actions.map(a => (
                      <button key={a.label}
                        className="px-3.5 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-transform"
                        style={a.primary
                          ? { background: ACCENT, color: ACCENT_TEXT, border: "none" }
                          : { background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
                              border: "0.5px solid var(--color-border-tertiary)" }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Unread dot */}
              {n.unread && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: ACCENT }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
const ACCENT = "#09f2a6";
const ACCENT_DIM = "rgba(9,242,166,0.1)";
const ACCENT_TEXT = "#022b1e";

const stats = [
  {
    label: "Played",
    value: 32,
    color: ACCENT,
    iconStroke: "var(--color-text-secondary)",
    bgIcon: "var(--color-background-secondary)",
    highlighted: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2M6 4h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z" />
      </svg>
    ),
  },
  {
    label: "Wins",
    value: 24,
    highlighted: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
  {
    label: "Losses",
    value: 8,
    highlighted: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    label: "Friends",
    value: 10,
    highlighted: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
];

export default function UserMetaCard() {
  return (
    <div className="dark:bg-white/5 rounded-[25px] overflow-hidden">
      {/* Avatar row */}
      <div className="px-5 mt-3 flex items-end justify-between mb-2">
        <div className="relative inline-block">
          <img
            src="https://api.dicebear.com/9.x/big-smile/svg?seed=zo3twbi2&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
            alt="User"
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          {/* <button
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: ACCENT }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button> */}
        </div>
      </div>

      {/* Name + meta */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[17px] font-extrabold text-gray-900 dark:text-white">
            @datboifrom_imo
          </span>
          <div className="rounded-full text-center w-[50px] px-2 pb-1" style={{ background: ACCENT_DIM, border: `0.5px solid rgba(9,242,166,0.2)` }}>
            <span className="text-[10px] font-bold">Lvl 14</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="text-gray-400">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs text-gray-400">Michael Alaoma</span>
          <span className="w-px h-2.5 bg-gray-200 dark:bg-white/10 inline-block" />
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="text-gray-400">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs text-gray-400">Lagos, Nigeria</span>
        </div>

        {/* XP bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">XP Progress</span>
            <span className="text-[10px] font-bold">1,200 / 2,000</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "60%", background: ACCENT }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl py-2.5 px-3"
              >
              {/* <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-0.5"
                style={{ background: s.highlighted ? "rgba(9,242,166,0.15)" : s.label === "Losses" ? "rgba(239,68,68,0.1)" : "var(--color-background-primary)" }}>
                {s.icon}
              </div> */}
              <span className="text-[17px] font-extrabold"
                style={{ color: s.highlighted ? ACCENT : "var(--color-text-primary)" }}>
                {s.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: s.highlighted ? ACCENT : "var(--color-text-tertiary)", opacity: s.highlighted ? 0.7 : 1 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
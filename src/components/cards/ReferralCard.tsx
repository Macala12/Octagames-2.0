import { useNavigate } from "react-router";

const ACCENT = "#09f2a6";

interface Props {
  referredCount?: number;
  referralTarget?: number;
  totalEarned?: number;
  referredAvatars?: { initial: string; color: string }[];
}

export default function ReferralCard({
  referredCount = 2,
  referralTarget = 5,
  totalEarned = 600,
  referredAvatars = [
    { initial: "M", color: "#7C3AED" },
    { initial: "A", color: "#0369A1" },
    { initial: "K", color: "#15803D" },
  ],
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-[22px] overflow-hidden p-6" style={{ background: "#0a0a0a" }} onClick={() => navigate("/referral")}>

      {/* Abstract background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="rdots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill="url(#rdots)" />
        <ellipse cx="370" cy="20"  rx="130" ry="100" fill="#09f2a6" opacity="0.07" />
        <ellipse cx="390" cy="40"  rx="80"  ry="60"  fill="#09f2a6" opacity="0.08" />
        <ellipse cx="30"  cy="180" rx="100" ry="80"  fill="#7C3AED" opacity="0.1"  />
        <circle cx="370" cy="200" r="110" fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.12" />
        <circle cx="370" cy="200" r="75"  fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.1"  />
        <circle cx="370" cy="200" r="44"  fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="140" x2="200" y2="0" stroke="rgba(9,242,166,0.04)" strokeWidth="50" />
      </svg>

      {/* Content */}
      <div className="relative z-10">

        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(9,242,166,0.12)", border: "0.5px solid rgba(9,242,166,0.25)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-[13px] font-bold uppercase tracking-wide text-white/50">
              Refer & Earn
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(9,242,166,0.12)", border: "0.5px solid rgba(9,242,166,0.3)" }}>
            <span className="text-[11px] font-extrabold" style={{ color: ACCENT }}>Let's Go {">"} </span>
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-[22px] font-extrabold text-white leading-tight tracking-tight mb-2">
          Invite friends,<br />earn together 🎉
        </h3>

        {/* Subtext */}
        <p className="text-[13px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
          Share your link and earn{" "}
          <span className="font-bold" style={{ color: ACCENT }}>₦300</span>
          {" "}for every friend who joins and plays.
        </p>

        {/* Progress tile */}
        <div className="rounded-2xl px-4 py-3 flex items-center justify-between mb-5"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,0.35)" }}>Friends Referred</p>
              <p className="text-[20px] font-extrabold text-white leading-none">
                {referredCount}
                <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {" "}/ {referralTarget}
                </span>
              </p>
            </div>

            {/* Avatar stack */}
            <div className="flex">
              {referredAvatars.map((a, i) => (
                <div key={i}
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2"
                  style={{
                    background: a.color,
                    borderColor: "#0a0a0a",
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: referredAvatars.length - i,
                  }}>
                  {a.initial}
                </div>
              ))}
              {referralTarget - referredAvatars.length > 0 && (
                <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 text-[9px] font-bold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "#0a0a0a",
                    marginLeft: -8,
                    color: "rgba(255,255,255,0.4)",
                  }}>
                  +{referralTarget - referredAvatars.length}
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{ color: "rgba(255,255,255,0.35)" }}>Earned</p>
            <p className="text-[18px] font-extrabold" style={{ color: ACCENT }}>
              ₦{totalEarned.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
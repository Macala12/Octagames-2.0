// ─── 3. HowChallengesWorkContent.tsx ─────────────────────────────────────────
const steps = [
  { emoji: "🎯", step: 1, title: "Pick a Challenge",   desc: "Browse active challenges and choose a game with a target score and reward that suits you." },
  { emoji: "🪙", step: 2, title: "Enter Your Stake",    desc: "Decide how many Octacoins to wager. Higher stakes mean bigger potential rewards." },
  { emoji: "🎮", step: 3, title: "Hit the Target",      desc: "Play the game and reach the required score before time runs out." },
  { emoji: "🏆", step: 4, title: "Win Rewards",         desc: "Meet the target and earn coins or cash rewards instantly — credited to your wallet." },
]

const ACCENT = "#09f2a6", AT = "#022b1e"

export default function HowChallengesWorkContent() {
  return (
    <div className="flex flex-col max-w-lg mx-auto pb-8">
      {/* Hero */}
      <div className="relative rounded-[20px] overflow-hidden p-7 mb-5 text-center" style={{ background: "#0a0a0a" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 110" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="hp" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.05)"/></pattern></defs>
          <rect width="360" height="110" fill="url(#hp)"/>
          <ellipse cx="300" cy="20" rx="130" ry="90" fill="#09f2a6" opacity="0.06"/>
          <ellipse cx="60" cy="100" rx="90" ry="65" fill="#7C3AED" opacity="0.08"/>
          <circle cx="300" cy="110" r="90" fill="none" stroke="#09f2a6" strokeWidth="0.5" opacity="0.12"/>
        </svg>
        <div className="relative">
          <div className="text-[36px] mb-2" style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.4))" }}>🎮</div>
          <p className="text-[19px] font-extrabold text-white mb-1">How Challenges Work</p>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>Complete 4 simple steps to win</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2.5 px-1">
        {steps.map((s, i) => (
          <div key={s.step}
            className="flex items-start gap-3.5 p-4 rounded-[18px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8"
            style={{ animation: `fadeUp 0.3s ease ${i * 60}ms both` }}>
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(9,242,166,0.1)", border: "0.5px solid rgba(9,242,166,0.2)" }}>
              {s.emoji}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Step {s.step}</p>
              <p className="text-[14px] font-extrabold text-gray-900 dark:text-white mb-1">{s.title}</p>
              <p className="text-[12px] leading-relaxed text-gray-500 dark:text-white/50">{s.desc}</p>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0"
              style={{ background: ACCENT, color: AT }}>
              {s.step}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
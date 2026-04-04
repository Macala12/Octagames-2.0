import React from "react";

interface Challenge {
  id: string;
  gameTitle: string;
  targetScore: number;
  reward: number;
  image?: string;
  label?: string;
  color?: "purple" | "gold" | "green" | "blue";
}

interface Props {
  challenges: Challenge[];
  onClick?: (challenge: Challenge) => void;
}

const colorMap = {
  purple: { bg: "#7C3AED", accent: "#A78BFA" },
  gold:   { bg: "#B45309", accent: "#FCD34D" },
  green:  { bg: "#065F46", accent: "#6EE7B7" },
  blue:   { bg: "#1E40AF", accent: "#93C5FD" },
};

const GamepadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="3" />
    <path d="M12 2v4M8 2h8" />
    <circle cx="8.5" cy="13.5" r="1.5" fill="rgba(255,255,255,0.9)" stroke="none" />
    <circle cx="15.5" cy="13.5" r="1.5" fill="rgba(255,255,255,0.9)" stroke="none" />
  </svg>
);

export default function ChallengeList({ challenges, onClick }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {challenges.map((challenge) => {
        const { bg, accent } = colorMap[challenge.color ?? "purple"];

        return (
          <div
            key={challenge.id}
            onClick={() => onClick?.(challenge)}
            className="flex items-stretch rounded-[10px] overflow-hidden bg-white cursor-pointer active:scale-[0.98] transition-transform"
          >
            {/* Left image panel */}
            <div
              className="relative w-24 min-w-24 flex flex-col items-center justify-center gap-2 px-2 py-3 overflow-hidden"
              style={{ background: bg }}
            >
              {/* Decorative blobs */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute w-20 h-20 rounded-full -top-5 -left-5"
                  style={{ background: accent }} />
                <div className="absolute w-14 h-14 rounded-full -bottom-4 -right-4"
                  style={{ background: accent }} />
              </div>

              {/* Game image or placeholder icon */}
              <div className="relative w-13 h-13 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                {challenge.image ? (
                  <img
                    src={challenge.image}
                    alt={challenge.gameTitle}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <GamepadIcon />
                )}
              </div>

              <span className="relative text-[10px] font-semibold uppercase tracking-wide text-white/80">
                {challenge.label ?? "Game"}
              </span>
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-between flex-1 min-w-0 p-3.5">
              <div>
                <p className="text-[15px] font-semibold text-gray-900 truncate">
                  {challenge.gameTitle}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  Reach a score of{" "}
                  <span className="text-gray-700 font-medium">
                    {challenge.targetScore.toLocaleString()}
                  </span>{" "}
                  to win
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Prize</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{challenge.reward.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onClick?.(challenge); }}
                  className="text-xs font-semibold text-white px-4 py-2 rounded-full"
                  style={{ background: bg }}
                >
                  Play Now →
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import React from "react";

interface Props {
  streak: number;
  nextMilestone?: number;
  rewardCoins?: number;
  completedDays?: boolean[];
}

const UserStreak: React.FC<Props> = ({
  streak,
  nextMilestone = 7,
}) => {
  const isCompleted = streak >= nextMilestone;
  const remaining = nextMilestone - streak;

  return (
    <div className="flex mt-4">
      <div className="w-full pr-3 text-center grid grid-cols-2 gap-2">
        
        <div className="">
          {/* Flame icon with glow ring */}
          <div className="relative inline-flex items-center justify-center w-28 h-[fit-content] mb-3">
            <div className="absolute inset-0 rounded-full border border-gray-100" />
            <div className="absolute w-10 h-10 rounded-full bg-orange-50 opacity-60" />
            <span className="text-3xl relative z-10">🔥</span>
          </div>

          {/* Streak number */}
          <div className="text-3xl font-bold text-gray-900 leading-none mb-2">
            {streak}
          </div>
          <div className="text-sm text-gray-400">Current Streak!</div>
        </div>
        
        <div className="p-2">
          {/* Days of week */}
          <div className="text-center gap-2">
            <h4 className="text-[25px]">🔒</h4>
            <h4 className="font-bold text-[20px]">N1000</h4>
            <p className="text-[12px] text-gray-500">Next Reward</p>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-400">
            {isCompleted ? (
              <>Milestone reached! Claim your Octacoins!</>
            ) : (
              <>
                <span className="text-gray-700 font-medium">{remaining} more day{remaining !== 1 ? "s" : ""}</span>
                {" "}to unlock{" "}
              </>
            )}
          </p>

          {/* Claim button */}
          {isCompleted && (
            <button className="mt-4 w-full text-left py-3 rounded-lg text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #FF6D00, #E53935)" }}>
              Claim Reward 🪙
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStreak;
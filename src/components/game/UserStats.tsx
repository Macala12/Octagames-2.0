import React, { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

// 🔢 Animated counter hook
const useCountUp = (end: number, duration = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

const stats: Stat[] = [
  {
    label: "Wins",
    value: 24,
    icon: "🏆",
    color: "from-green-500 to-emerald-400",
  },
  {
    label: "Losses",
    value: 8,
    icon: "❌",
    color: "from-red-500 to-pink-400",
  },
  {
    label: "Played",
    value: 32,
    icon: "🎮",
    color: "from-blue-500 to-indigo-400",
  },
  {
    label: "XP",
    value: 1200,
    icon: "⚡",
    color: "from-yellow-400 to-orange-400",
  },
];

const GameStatsCarousel: React.FC = () => {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        Your Stats
      </h2>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {stats.map((stat) => {
          const animatedValue = useCountUp(stat.value);

          return (
            <div
              key={stat.label}
              className="min-w-[110px] flex-shrink-0 rounded-xl p-4 text-white shadow-md bg-gradient-to-br"
              style={{
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
              }}
            >
              {/* Gradient */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-90`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-xl">{stat.icon}</span>

                <div>
                  <h3 className="text-lg font-bold">
                    {animatedValue}
                  </h3>
                  <p className="text-xs opacity-80">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameStatsCarousel;
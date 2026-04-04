import { useEffect, useRef } from "react";

const winners = [
  { username: "michael123", amount: 2500, time: "2 mins ago" },
  { username: "ade_dev", amount: 5000, time: "5 mins ago" },
  { username: "tobiX", amount: 1200, time: "1 min ago" },
  { username: "queenBee", amount: 8000, time: "10 mins ago" },
];

export default function WinnersMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationFrame: number;
    let scrollAmount = 0;

    const scroll = () => {
      scrollAmount += 0.5; // speed control
      if (scrollAmount >= marquee.scrollWidth / 2) {
        scrollAmount = 0;
      }
      marquee.scrollLeft = scrollAmount;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative w-full overflow-hidden mt-3 rounded-2xl p-3">
      <div
        ref={marqueeRef}
        className="flex gap-6 overflow-hidden whitespace-nowrap"
      >
        {[...winners, ...winners].map((winner, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-white bg-white/5 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <span className="font-semibold text-green-400">
              {winner.username}
            </span>

            <span className="text-white/80">
              just won
            </span>

            <span className="font-bold text-yellow-400">
              ₦{winner.amount.toLocaleString()}
            </span>

            <span className="text-white/50">
              • {winner.time}
            </span>

            <span>
                🏆
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
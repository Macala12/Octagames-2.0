import { useEffect, useRef } from "react";

const winners = [
  { username: "michael123", amount: 2500, time: "2 mins ago", game: "FIFA 25" },
  { username: "ade_dev", amount: 5000, time: "5 mins ago", game: "Mortal Kombat" },
  { username: "tobiX", amount: 1200, time: "1 min ago", game: "Call of Duty" },
  { username: "queenBee", amount: 8000, time: "10 mins ago", game: "eFootball" },
  { username: "zeroKing", amount: 3300, time: "3 mins ago", game: "Tekken 8" },
];

const TrophyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD700">
    <path d="M7 4V2h10v2h3a1 1 0 0 1 1 1v3c0 2.76-1.86 5.08-4.4 5.8A6.002 6.002 0 0 1 13 18v2h2v2H9v-2h2v-2a6.002 6.002 0 0 1-3.6-4.2C4.86 13.08 3 10.76 3 8V5a1 1 0 0 1 1-1h3zm0 2H5v2c0 1.63.97 3.03 2.38 3.67A6.03 6.03 0 0 1 7 10V6zm10 0v4c0 .45-.05.89-.13 1.31C18.07 10.7 19 9.45 19 8V6h-2zm-5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

const CoinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">₦</text>
  </svg>
);

const WinnerPill = ({ winner }: { winner: typeof winners[0] }) => (
  <div className="inline-flex items-center gap-2.5 hover:border-white/20 px-4 py-2 rounded-[15px] transition-colors duration-200 group shrink-0">
    {/* Live pulse dot */}
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12b76a] opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#12b76a]" />
    </span>

    {/* Username */}
    <span className="text-[13px] font-black text-black tracking-wide">
      {winner.username}
    </span>

    {/* Divider */}
    <span className="text-black/30 text-xs">|</span>

    {/* Game name */}
    <span className="text-[11px] text-black/50 font-medium tracking-wide">
      {winner.game}
    </span>

    {/* Divider */}
    <span className="text-black/70 text-xs">|</span>

    {/* Won label */}
    <span className="text-[11px] text-black/70">won</span>

    {/* Amount */}
    <span className="inline-flex items-center gap-1">
      <CoinIcon />
      <span className="text-[13px] font-black text-[#FBBF24] tracking-wide">
        ₦{winner.amount.toLocaleString()}
      </span>
    </span>

    {/* Trophy */}
    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
      <TrophyIcon />
    </span>

    {/* Time */}
    <span className="text-[10px] text-black/50 font-medium tracking-wider">
      {winner.time}
    </span>
  </div>
);

export default function WinnersMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const scroll = () => {
      scrollRef.current += 0.6;
      if (scrollRef.current >= marquee.scrollWidth / 2) {
        scrollRef.current = 0;
      }
      marquee.scrollLeft = scrollRef.current;
      animRef.current = requestAnimationFrame(scroll);
    };

    animRef.current = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animRef.current!);
  }, []);

  return (
    <div className="relative w-full mt-2 mb-2 rounded-2xl overflow-hidden">
      {/* Scrolling track */}
      <div
        ref={marqueeRef}
        className="flex gap-3 overflow-hidden whitespace-nowrap px-4 py-3"
      >
        {[...winners, ...winners].map((winner, index) => (
          <WinnerPill key={index} winner={winner} />
        ))}
      </div>
    </div>
  );
}
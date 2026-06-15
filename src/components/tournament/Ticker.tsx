import { useState, useEffect, useRef } from "react";

const defaultActivities = [
  { id: 1, icon: "", text: "Michael just joined the tournament" },
  { id: 2, icon: "", text: "Susan scored 50 in the challenge" },
  { id: 3, icon: "", text: "David is playing right now" },
  { id: 4, icon: "", text: "Aisha is on a 7-win streak" },
  { id: 5, icon: "", text: "Leo unlocked a new achievement" },
  { id: 6, icon: "", text: "Priya just joined the tournament" },
];

interface ActivityItem {
  id: number;
  icon?: string;
  text: string;
}

interface ActivityTickerProps {
  items?: ActivityItem[];
  holdDuration?: number;
  transitionDuration?: number;
}

export default function ActivityTicker({
  items = defaultActivities,
  holdDuration = 3000,
  transitionDuration = 400,
}: ActivityTickerProps) {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "exiting" | "entering">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      setAnimState("exiting");
    }, holdDuration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, items, holdDuration]);

  useEffect(() => {
    if (animState !== "exiting") return;

    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
      setAnimState("entering");
    }, transitionDuration);

    return () => clearTimeout(timeout);
  }, [animState, items.length, transitionDuration]);

  useEffect(() => {
    if (animState !== "entering") return;

    rafRef.current = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setAnimState("idle"));
      rafRef.current = raf2;
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animState]);

  if (!items || items.length === 0) return null;

  const current = items[index];

  const transformClass =
    animState === "exiting"
      ? "-translate-y-full"
      : animState === "entering"
      ? "translate-y-full"
      : "translate-y-0";

  const opacityClass = animState === "idle" ? "opacity-100" : "opacity-0";

  const transitionStyle =
    animState === "entering"
      ? undefined
      : {
          transition: `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${transitionDuration}ms ease`,
        };

  return (
    <div className="inline-flex">
      <div className="relative h-11 min-w-[230px] overflow-hidden rounded-[20px] bg-[#000] px-4 flex items-center backdrop-blur-sm">
        {/* Subtle accent glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7C3AED]/[0.02] to-transparent pointer-events-none" />
        
        <div
          key={current.id}
          className={`
            absolute left-4 right-4 flex items-center gap-2.5
            text-[13px] font-semibold text-[#7C3AED]/90
            whitespace-nowrap overflow-hidden text-ellipsis
            ${transformClass} ${opacityClass}
          `}
          style={transitionStyle}
        >
          {current.icon && (
            <span className="text-base shrink-0">{current.icon}</span>
          )}
          <span className="overflow-hidden text-ellipsis">{current.text}</span>          
        </div>
      </div>
    </div>
  );
}
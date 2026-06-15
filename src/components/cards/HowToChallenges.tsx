import React from "react";
import NeubrutalistCard from "../ui/cards/NeuCard";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step {
  step: number;
  emoji: string;
  title: string;
  desc: string;
}

interface StepsListProps {
  steps: Step[];
  accentColor?: string;
  accentTextColor?: string;
}


// ─── Component ────────────────────────────────────────────────────────────────
export function StepsList({
  steps,
  accentColor = "#09F2A6",
  accentTextColor = "#111",
}: StepsListProps) {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="flex mt-8 mb-5 flex-nowrap gap-2.5 px-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((s, i) => (
                      <NeubrutalistCard
                        mainColor="#1f1f1f"
                        shadowColor="#09F2A6"
                        pressable
                        shadowOffsetX={5}
                        shadowOffsetY={5}
                        borderRadius={0}
                      >
                        <div
                            key={s.step}
                            className="w-[150px] h-[65px] flex items-start gap-3.5 p-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8"
                            style={{ animation: `fadeUp 0.3s ease ${i * 60}ms both` }}
                        >
                            {/* Text */}
                            <div className="flex-1">
                            <p className="text-[14px] text-black font-extrabold dark:text-black mb-1">
                                {s.title}
                            </p>
                            </div>

                            {/* Step number badge */}
                            <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[19px] font-extrabold flex-shrink-0"
                            style={{ background: accentColor, color: accentTextColor }}
                            >
                            {s.step}
                            </div>
                        </div>
                      </NeubrutalistCard>

        ))}
      </div>
    </>
  );
}
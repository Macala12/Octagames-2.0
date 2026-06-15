"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Gift, Check, Star, Zap, Trophy} from "lucide-react";
import BottomSheet from "../ui/bottom-sheet/BottomSheet";

// ─── Types ───────────────────────────────────────────────────────────

interface Reward {
  id: string;
  type: "coins" | "gems" | "xp" | "item";
  amount: number;
  image: string;
  label: string;
}

interface DayStreak {
  day: number;
  claimed: boolean;
  reward: Reward;
  date: string; // ISO date
}

// interface Mission {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   progress: number;
//   total: number;
//   reward: Reward;
//   completed: boolean;
//   claimed: boolean;
// }

// ─── Constants ─────────────────────────────────────────────────────

// const ACCENT = "#7C3AED";
// const PRIMARY = "#0A0A0A";

const WEEKLY_REWARDS: Reward[] = [
  { id: "d1", type: "coins", amount: 100, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins1&backgroundColor=FFD60A", label: "100 Coins" },
  { id: "d2", type: "coins", amount: 200, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins2&backgroundColor=FFD60A", label: "200 Coins" },
  { id: "d3", type: "gems", amount: 5, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems1&backgroundColor=FF6B6B", label: "5 Gems" },
  { id: "d4", type: "coins", amount: 300, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins3&backgroundColor=FFD60A", label: "300 Coins" },
  { id: "d5", type: "xp", amount: 500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=xp1&backgroundColor=4ECDC4", label: "500 XP" },
  { id: "d6", type: "gems", amount: 10, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems2&backgroundColor=FF6B6B", label: "10 Gems" },
  { id: "d7", type: "item", amount: 1, image: "https://api.dicebear.com/9.x/identicon/svg?seed=chest1&backgroundColor=FFD60A", label: "Mystery Box" },
];

// Generate 30 days of rewards
const generate30Days = (): DayStreak[] => {
  const rewards: Reward[] = [
    ...WEEKLY_REWARDS,
    { id: "d8", type: "coins", amount: 400, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins4&backgroundColor=FFD60A", label: "400 Coins" },
    { id: "d9", type: "gems", amount: 15, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems3&backgroundColor=FF6B6B", label: "15 Gems" },
    { id: "d10", type: "coins", amount: 500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins5&backgroundColor=FFD60A", label: "500 Coins" },
    { id: "d11", type: "xp", amount: 1000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=xp2&backgroundColor=4ECDC4", label: "1K XP" },
    { id: "d12", type: "coins", amount: 600, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins6&backgroundColor=FFD60A", label: "600 Coins" },
    { id: "d13", type: "gems", amount: 20, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems4&backgroundColor=FF6B6B", label: "20 Gems" },
    { id: "d14", type: "item", amount: 1, image: "https://api.dicebear.com/9.x/identicon/svg?seed=chest2&backgroundColor=FFD60A", label: "Rare Chest" },
    { id: "d15", type: "coins", amount: 1000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins7&backgroundColor=FFD60A", label: "1K Coins" },
    { id: "d16", type: "xp", amount: 1500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=xp3&backgroundColor=4ECDC4", label: "1.5K XP" },
    { id: "d17", type: "gems", amount: 25, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems5&backgroundColor=FF6B6B", label: "25 Gems" },
    { id: "d18", type: "coins", amount: 1500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins8&backgroundColor=FFD60A", label: "1.5K Coins" },
    { id: "d19", type: "item", amount: 1, image: "https://api.dicebear.com/9.x/identicon/svg?seed=chest3&backgroundColor=FFD60A", label: "Epic Box" },
    { id: "d20", type: "coins", amount: 2000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins9&backgroundColor=FFD60A", label: "2K Coins" },
    { id: "d21", type: "gems", amount: 30, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems6&backgroundColor=FF6B6B", label: "30 Gems" },
    { id: "d22", type: "xp", amount: 2500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=xp4&backgroundColor=4ECDC4", label: "2.5K XP" },
    { id: "d23", type: "coins", amount: 3000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins10&backgroundColor=FFD60A", label: "3K Coins" },
    { id: "d24", type: "gems", amount: 50, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems7&backgroundColor=FF6B6B", label: "50 Gems" },
    { id: "d25", type: "item", amount: 1, image: "https://api.dicebear.com/9.x/identicon/svg?seed=chest4&backgroundColor=FFD60A", label: "Legendary" },
    { id: "d26", type: "coins", amount: 5000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins11&backgroundColor=FFD60A", label: "5K Coins" },
    { id: "d27", type: "xp", amount: 5000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=xp5&backgroundColor=4ECDC4", label: "5K XP" },
    { id: "d28", type: "gems", amount: 75, image: "https://api.dicebear.com/9.x/identicon/svg?seed=gems8&backgroundColor=FF6B6B", label: "75 Gems" },
    { id: "d29", type: "coins", amount: 10000, image: "https://api.dicebear.com/9.x/identicon/svg?seed=coins12&backgroundColor=FFD60A", label: "10K Coins" },
    { id: "d30", type: "item", amount: 1, image: "https://api.dicebear.com/9.x/identicon/svg?seed=chest5&backgroundColor=FFD60A", label: "MAX REWARD" },
  ];

  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    claimed: i < 3, // Demo: first 3 days claimed
    reward: rewards[i],
    date: new Date(Date.now() - (2 - i) * 86400000).toISOString(), // Demo dates
  }));
};

// const INITIAL_MISSIONS: Mission[] = [
//   {
//     id: "m1",
//     title: "First Blood",
//     description: "Win your first tournament match",
//     icon: <Sword size={18} />,
//     progress: 1,
//     total: 1,
//     reward: { id: "mr1", type: "coins", amount: 500, image: "https://api.dicebear.com/9.x/identicon/svg?seed=mr1&backgroundColor=FFD60A", label: "500 Coins" },
//     completed: true,
//     claimed: false,
//   },
//   {
//     id: "m2",
//     title: "Streak Starter",
//     description: "Maintain a 3-day login streak",
//     icon: <Flame size={18} />,
//     progress: 2,
//     total: 3,
//     reward: { id: "mr2", type: "gems", amount: 10, image: "https://api.dicebear.com/9.x/identicon/svg?seed=mr2&backgroundColor=FF6B6B", label: "10 Gems" },
//     completed: false,
//     claimed: false,
//   },
// ];

// ─── Components ───────────────────────────────────────────────────

function StreakDay({ day, isActive, isToday, onClaim }: { 
  day: DayStreak; 
  isActive: boolean; 
  isToday: boolean;
  onClaim: (day: DayStreak) => void;
}) {
  const isClaimed = day.claimed;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`
        relative flex flex-col items-center gap-1.5 min-w-[72px] 
        ${isActive ? "opacity-100" : "opacity-40"}
      `}
    >
      {/* Day circle */}
      <div 
        onClick={() => isToday && !isClaimed && onClaim(day)}
        className={`
          relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer
          ${isClaimed 
            ? "bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/5 border-2 border-[#7C3AED]/40" 
            : isToday
              ? "bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/70 border-2 border-[#7C3AED] shadow-[0_0_20px_rgba(255,214,10,0.3)] animate-pulse"
              : "bg-white/5 border-2 border-white/10 hover:border-white/20"
          }
        `}
      >
        {isClaimed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <img src={day.reward.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ) : isToday ? (
          <Gift size={20} className="text-[#0A0A0A]" />
        ) : (
          <span className="text-[15px] font-bold text-black/60">{day.day}</span>
        )}
        
        {/* Checkmark for claimed */}
        {isClaimed && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center">
            <Check size={12} className="text-[#0A0A0A]" strokeWidth={3} />
          </div>
        )}
      </div>
      
      {/* Label */}
      <span className={`
        text-[10px] font-bold tracking-wide
        ${isClaimed ? "text-[#000]/70" : isToday ? "text-[#000]" : "text-black/30"}
      `}>
        {isClaimed ? "CLAIMED" : isToday ? "TODAY" : `DAY ${day.day}`}
      </span>
    </motion.div>
  );
}

// function MissionItem({ mission, onClaim }: { mission: Mission; onClaim: (m: Mission) => void }) {
//   const progressPct = Math.min((mission.progress / mission.total) * 100, 100);
//   const isComplete = mission.completed;
//   const isClaimed = mission.claimed;
  
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ 
//         opacity: isClaimed ? 0 : 1, 
//         x: isClaimed ? 100 : 0,
//         height: isClaimed ? 0 : "auto",
//       }}
//       exit={{ opacity: 0, x: 100, height: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className={`
//         relative overflow-hidden rounded-xl border transition-all duration-300
//         ${isComplete 
//           ? "bg-gradient-to-r from-[#7C3AED]/10 to-transparent border-[#7C3AED]/30 shadow-[0_0_16px_rgba(255,214,10,0.1)]" 
//           : "bg-white/[0.03] border-white/10 hover:border-white/20"
//         }
//       `}
//     >
//       <div className="flex items-center gap-3 p-3.5">
//         {/* Icon */}
//         <div className={`
//           w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
//           ${isComplete ? "bg-[#7C3AED]/20 text-[#000]" : "bg-white/5 text-black/40"}
//         `}>
//           {mission.icon}
//         </div>
        
//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h4 className={`text-[13px] font-bold ${isComplete ? "text-black" : "text-black/80"}`}>
//               {mission.title}
//             </h4>
//             <span className="text-[10px] font-bold text-[#000]/70">
//               {mission.reward.label}
//             </span>
//           </div>
          
//           <p className="text-[11px] text-black/40 mb-2">{mission.description}</p>
          
//           {/* Progress bar */}
//           <div className="flex items-center gap-2">
//             <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
//               <motion.div 
//                 className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED]/70"
//                 initial={{ width: 0 }}
//                 animate={{ width: `${progressPct}%` }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//               />
//             </div>
//             <span className="text-[10px] font-bold text-black/50 tabular-nums">
//               {mission.progress}/{mission.total}
//             </span>
//           </div>
//         </div>
        
//         {/* Action */}
//         {isComplete && !isClaimed ? (
//           <button
//             onClick={() => onClaim(mission)}
//             className="flex-shrink-0 w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,214,10,0.4)]"
//           >
//             <Gift size={16} className="text-[#0A0A0A]" />
//           </button>
//         ) : isClaimed ? (
//           <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
//             <Check size={16} className="text-emerald-400" />
//           </div>
//         ) : (
//           <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
//             <ChevronRight size={16} className="text-black/20" />
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }

function RewardClaimSheet({ reward, onClaim, isOpen, onClose }: {
  reward: Reward | null;
  onClaim: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!reward) return null;
  
  return (
    <BottomSheet
      title="Reward Available!"
      subtitle="You've earned this for your dedication"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col items-center py-8 px-4">
        {/* Glow effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#7C3AED]/20 blur-3xl rounded-full scale-150" />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/5 border-2 border-[#7C3AED]/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,214,10,0.2)]"
          >
            <img src={reward.image} alt="" className="w-20 h-20 object-contain" />
          </motion.div>
          
          {/* Floating particles */}
          <motion.div
            animate={{ y: [-10, -30, -10], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2"
          >
            <Star size={16} className="text-[#000] fill-[#7C3AED]" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, -25, -5], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-4 -left-4"
          >
            <Zap size={12} className="text-[#000]" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, -25, -5], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute top-4 -right-4"
          >
            <Trophy size={12} className="text-[#000]" />
          </motion.div>
        </div>
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="text-[22px] font-black text-black mb-2">{reward.label}</h3>
          <p className="text-[13px] text-black/50">Added to your inventory</p>
        </motion.div>
        
        {/* Claim button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClaim}
          className="w-full max-w-[280px] py-4 rounded-2xl bg-[#7C3AED] text-[#0A0A0A] font-black text-[16px] tracking-wide shadow-[0_0_30px_rgba(255,214,10,0.3)] hover:shadow-[0_0_40px_rgba(255,214,10,0.5)] transition-shadow flex items-center justify-center gap-2"
        >
          <Gift size={20} />
          CLAIM REWARD
        </motion.button>
      </div>
    </BottomSheet>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function StreakAndMissions() {
  const [streakDays, setStreakDays] = useState<DayStreak[]>(generate30Days());
  // const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = days 1-7, 1 = 8-14, etc.
  const [isExpanded, setIsExpanded] = useState(false);
  const [claimSheet, setClaimSheet] = useState<{ open: boolean; reward: Reward | null; type: "streak" | "mission"; id: string }>({
    open: false,
    reward: null,
    type: "streak",
    id: "",
  });
  
  const todayIndex = streakDays.findIndex(d => !d.claimed) !== -1 
    ? streakDays.findIndex(d => !d.claimed) 
    : streakDays.length - 1;
  
  const currentWeekFromToday = Math.floor(todayIndex / 7);
  
  // Auto-advance week based on today
  useEffect(() => {
    setCurrentWeek(currentWeekFromToday);
  }, [currentWeekFromToday]);
  
  const visibleDays = isExpanded 
    ? streakDays 
    : streakDays.slice(currentWeek * 7, (currentWeek + 1) * 7);
  
  const canGoNext = (currentWeek + 1) * 7 < 30;
  const canGoPrev = currentWeek > 0;
  
  const handleStreakClaim = useCallback((day: DayStreak) => {
    setClaimSheet({ open: true, reward: day.reward, type: "streak", id: day.day.toString() });
  }, []);
  
  // const handleMissionClaim = useCallback((mission: Mission) => {
  //   setClaimSheet({ open: true, reward: mission.reward, type: "mission", id: mission.id });
  // }, []);
  
  const confirmClaim = useCallback(() => {
    const { type, id } = claimSheet;
    
    if (type === "streak") {
      setStreakDays(prev => prev.map(d => 
        d.day.toString() === id ? { ...d, claimed: true } : d
      ));
    } else {
      // setMissions((prev: any[]) => prev.map(m => 
      //   m.id === id ? { ...m, claimed: true } : m
      // ));
    }
    
    setClaimSheet(prev => ({ ...prev, open: false }));
  }, [claimSheet]);
  
  // Simulate new day detection (in real app, compare dates)
  const currentStreak = streakDays.filter(d => d.claimed).length;
  
  return (
    <div className="w-full max-w-md mx-auto">
      
      {/* ═══════════════════════════════════════
          DAILY STREAK SECTION
         ═══════════════════════════════════════ */}
      <section className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 text-[30px] rounded-xl flex items-center justify-center">
             🔥
            </div>
            <div>
              <p className="text-[16px] font-bold text-black">Daily Streak</p>
              <p className="text-[11px] text-black/40">
                <span className="text-[#000] font-bold">{currentStreak}</span> day streak! Keep it burning!
              </p>
            </div>
          </div>
          
          {/* Expand/Collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#fff] hover:text-[#000] transition-colors px-3 py-1.5 rounded-full bg-[#000]"
          >
            {isExpanded ? (
              <>
                <ChevronLeft size={14} />
                SHOW WEEK
              </>
            ) : (
              <>
                VIEW ALL
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
        
        {/* Week navigation (only when collapsed) */}
        {!isExpanded && (
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              onClick={() => setCurrentWeek(w => Math.max(0, w - 1))}
              disabled={!canGoPrev}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={14} className="text-black/60" />
            </button>
            <span className="text-[11px] font-bold text-black/30">
              DAYS {currentWeek * 7 + 1}-{Math.min((currentWeek + 1) * 7, 30)}
            </span>
            <button
              onClick={() => setCurrentWeek(w => w + 1)}
              disabled={!canGoNext}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20 hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={14} className="text-black/60" />
            </button>
          </div>
        )}
        
        {/* Days grid */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={isExpanded ? "expanded" : `week-${currentWeek}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`
                flex gap-2
                ${isExpanded ? "flex-wrap justify-center" : "overflow-x-auto pb-2 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
              `}
            >
              {visibleDays.map((day) => (
                <StreakDay
                  key={day.day}
                  day={day}
                  isActive={day.day <= todayIndex + 1}
                  isToday={day.day === todayIndex + 1 && !day.claimed}
                  onClaim={handleStreakClaim}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Streak fire animation at bottom */}
        {/* <div className="flex justify-center mt-2">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={14} className="text-[#000]" />
            </motion.div>
            <span className="text-[11px] font-bold text-[#000]/80">
              {currentStreak} day streak! Keep it burning!
            </span>
          </div>
        </div> */}
      </section>
      
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* ═══════════════════════════════════════
          REWARD CLAIM BOTTOM SHEET
         ═══════════════════════════════════════ */}
      <RewardClaimSheet
        reward={claimSheet.reward}
        isOpen={claimSheet.open}
        onClose={() => setClaimSheet(prev => ({ ...prev, open: false }))}
        onClaim={confirmClaim}
      />
    </div>
  );
}
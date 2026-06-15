"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Trophy, ChevronRight, Volume2, VolumeX, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
  probability: number;
  icon?: string;
}

interface SpinResult {
  segment: WheelSegment;
  amount: number;
}

// ─── Wheel Configuration ───────────────────────────────────────────────

const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: "Jackpot", color: "#FFD60A", textColor: "#0a0a0a", probability: 0.02, icon: "👑" },
  { label: "500", color: "#FF6B6B", textColor: "#fff", probability: 0.08, icon: "🔥" },
  { label: "100", color: "#4ECDC4", textColor: "#fff", probability: 0.15, icon: "✨" },
  { label: "Try Again", color: "#2D3748", textColor: "#fff", probability: 0.20, icon: "🔄" },
  { label: "50", color: "#A78BFA", textColor: "#fff", probability: 0.20, icon: "💎" },
  { label: "200", color: "#FFD60A", textColor: "#0a0a0a", probability: 0.15, icon: "⚡" },
  { label: "Mystery", color: "#FF6B6B", textColor: "#fff", probability: 0.15, icon: "🎁" },
  { label: "25", color: "#4ECDC4", textColor: "#fff", probability: 0.05, icon: "🪙" },
];

// ─── Confetti System ───────────────────────────────────────────────────

function ConfettiExplosion({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; color: string;
      size: number; rotation: number; rotationSpeed: number; opacity: number;
    }> = [];

    const colors = ["#FFD60A", "#FF6B6B", "#4ECDC4", "#A78BFA", "#fff", "#FF8C42"];

    // Create particles
    for (let i = 0; i < 150; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 5 + Math.random() * 15;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
      });
    }

    let animationId: number;
    const gravity = 0.4;
    const friction = 0.98;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;

        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        
        // Draw confetti shape (rectangle or circle)
        if (Math.random() > 0.5) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });

      if (alive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}

// ─── 3D Wheel Component ────────────────────────────────────────────────

function SpinningWheel({
  segments,
  spinning,
  rotation,
  onSpin,
}: {
  segments: WheelSegment[];
  spinning: boolean;
  rotation: number;
  onSpin: () => void;
}) {
  const segmentAngle = 360 / segments.length;
  const radius = 140;

  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      {/* Outer ring glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD60A]/20 via-[#FF6B6B]/10 to-[#4ECDC4]/20 blur-2xl animate-pulse" />

      {/* Wheel container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          boxShadow: "0 0 40px rgba(255,214,10,0.15), inset 0 0 60px rgba(0,0,0,0.3)",
          border: "4px solid rgba(255,255,255,0.1)",
        }}
        animate={{ rotate: rotation }}
        transition={spinning ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
      >
        {segments.map((segment, i) => {
          const startAngle = i * segmentAngle;
          const endAngle = (i + 1) * segmentAngle;

          // SVG path for segment
          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;
          const x1 = 150 + radius * Math.cos(startRad);
          const y1 = 150 + radius * Math.sin(startRad);
          const x2 = 150 + radius * Math.cos(endRad);
          const y2 = 150 + radius * Math.sin(endRad);

          const largeArc = segmentAngle > 180 ? 1 : 0;

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath: `path('M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z')`,
                background: segment.color,
              }}
            >
              {/* Segment text */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${startAngle + segmentAngle / 2}deg) translateY(-${radius * 0.65}px) translateX(-50%)`,
                  transformOrigin: "50% 50%",
                }}
              >
                <span className="text-[20px]">{segment.icon}</span>
                <span
                  className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
                  style={{ color: segment.textColor }}
                >
                  {segment.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Inner circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #FFD60A, #FF8C42)",
              boxShadow: "0 4px 20px rgba(255,214,10,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
            onClick={!spinning ? onSpin : undefined}
          >
            <span className="text-[24px] font-black text-[#0a0a0a]">SPIN</span>
          </div>
        </div>
      </motion.div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid #FFD60A",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Spinning glow effect */}
      {spinning && (
        <div className="absolute inset-0 rounded-full border-4 border-[#FFD60A]/50 animate-spin" style={{ animationDuration: "0.5s" }} />
      )}
    </div>
  );
}

// ─── Win Celebration UI ────────────────────────────────────────────────

function WinCelebration({ result, onClaim }: { result: SpinResult; onClaim: () => void }) {
  const isJackpot = result.segment.label === "Jackpot";
  const isTryAgain = result.segment.label === "Try Again";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        className="relative w-full max-w-sm overflow-hidden"
        style={{
          background: "#0a0a0a",
          borderRadius: 32,
          border: `3px solid ${isJackpot ? "#FFD60A" : isTryAgain ? "#4B5563" : result.segment.color}`,
          boxShadow: `0 0 60px ${result.segment.color}40`,
        }}
      >
        {/* Glow background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${result.segment.color}, transparent 70%)`,
          }}
        />

        <div className="relative p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[64px] mb-4"
          >
            {result.segment.icon}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[28px] font-black text-white mb-2"
          >
            {isTryAgain ? "So Close!" : isJackpot ? "JACKPOT!" : "You Won!"}
          </motion.h2>

          {/* Amount */}
          {!isTryAgain && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="mb-6"
            >
              <span
                className="text-[48px] font-black leading-none"
                style={{ color: result.segment.color }}
              >
                {isJackpot ? "₦50,000" : `${result.amount} OctaCoin`}
              </span>
              {isJackpot && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Trophy size={16} className="text-[#FFD60A]" />
                  <span className="text-[12px] font-bold text-[#FFD60A] uppercase tracking-wider">Grand Prize</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[14px] text-white/60 mb-8"
          >
            {isTryAgain
              ? "Spin again tomorrow for another chance!"
              : "Claim your reward and keep the streak alive!"}
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClaim}
            className="w-full py-4 rounded-2xl text-[16px] font-black text-[#0a0a0a] flex items-center justify-center gap-2"
            style={{
              background: isTryAgain ? "#374151" : "#FFD60A",
              boxShadow: isTryAgain ? "0 4px 0 #1f2937" : "0 4px 0 #B45309",
            }}
          >
            {isTryAgain ? (
              <>Come Back Tomorrow</>
            ) : (
              <>
                <Sparkles size={20} />
                CLAIM REWARD
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Live Ticker ───────────────────────────────────────────────────────

function LiveTicker() {
  const [spins, setSpins] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpins(s => s + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-[11px] font-bold text-white/70">
        {spins.toLocaleString()} spins today
      </span>
    </div>
  );
}

// ─── Main Promo Card ───────────────────────────────────────────────────

export default function SpinWheelPromo() {
  const [showWheel, setShowWheel] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const spin = useCallback(() => {
    if (spinning) return;

    setSpinning(true);
    setShowConfetti(false);

    // Random result based on probability
    const rand = Math.random();
    let cumulative = 0;
    let selected = WHEEL_SEGMENTS[0];

    for (const segment of WHEEL_SEGMENTS) {
      cumulative += segment.probability;
      if (rand <= cumulative) {
        selected = segment;
        break;
      }
    }

    // Calculate rotation (5-8 full spins + segment position)
    const segmentIndex = WHEEL_SEGMENTS.indexOf(selected);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const targetAngle = 360 * (5 + Math.floor(Math.random() * 3)) + (segmentIndex * segmentAngle) + (segmentAngle / 2);

    // Animate
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (targetAngle - startRotation) * eased;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const amount = selected.label === "Jackpot" ? 50000 : selected.label === "Try Again" ? 0 : parseInt(selected.label) || 100;
        setResult({ segment: selected, amount });
        if (selected.label !== "Try Again") {
          setShowConfetti(true);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [spinning, rotation]);

  const claimReward = () => {
    setResult(null);
    setShowConfetti(false);
    setShowWheel(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Confetti Layer */}
      <ConfettiExplosion active={showConfetti} />

      {/* Promo Card */}
      {!showWheel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[24px] overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 40%, #a78bfa 100%)",
            minHeight: 200,
            boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
          }}
          onClick={() => setShowWheel(true)}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating circles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 20 + i * 15,
                  height: 20 + i * 15,
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}

            {/* Sparkle lines */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(3)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={`${10 + i * 35}%`}
                  y1={`${20 + i * 20}%`}
                  x2={`${15 + i * 35}%`}
                  y2={`${30 + i * 20}%`}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                />
              ))}
            </svg>
          </div>

          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-6 flex flex-col h-full" style={{ minHeight: 200 }}>
            <div className="flex-1">
              {/* Live ticker */}
              <div className="mb-3">
                <LiveTicker />
              </div>

              <h3 className="text-[24px] font-black text-white leading-tight tracking-tight mb-2">
                Spin the Wheel<br />& Win Big
              </h3>

              <p className="text-[14px] text-white/80 leading-relaxed mb-4 max-w-[60%]">
                Try your luck once a day for exclusive rewards and bonus coins.
              </p>

              {/* Info pill */}
              <div className="absolute top-5 right-3 inline-flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white">
                  i
                </span>
                <span className="text-[11px] font-bold text-white/90">
                  Win up to 1000 OctaCoin
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              className="mt-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="flex items-center gap-2 bg-[#FFD60A] text-[#0a0a0a] font-black text-[14px] px-6 py-3 rounded-full shadow-[0_4px_0_#B45309] active:shadow-none active:translate-y-1 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWheel(true);
                }}
              >
                <Zap size={18} fill="currentColor" />
                SPIN NOW
                <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>

          {/* Wheel preview image */}
          <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #FFD60A, #FF6B6B, #4ECDC4, #A78BFA, #FFD60A)",
                opacity: 0.3,
                filter: "blur(2px)",
              }}
            />
            <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[48px]">🎰</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wheel Modal */}
      <AnimatePresence>
        {showWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative w-full max-w-md"
              style={{
                background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)",
                borderRadius: 32,
                border: "3px solid rgba(255,214,10,0.2)",
                boxShadow: "0 0 60px rgba(124,58,237,0.2)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <div>
                  <h2 className="text-[22px] font-black text-white">Daily Spin</h2>
                  <p className="text-[12px] text-white/50">One free spin per day</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button
                    onClick={() => setShowWheel(false)}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Wheel */}
              <div className="p-6 pt-2">
                <SpinningWheel
                  segments={WHEEL_SEGMENTS}
                  spinning={spinning}
                  rotation={rotation}
                  onSpin={spin}
                />

                {/* Spin button (fallback if center doesn't work) */}
                {!spinning && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={spin}
                    className="w-full mt-6 py-4 rounded-2xl bg-[#FFD60A] text-[#0a0a0a] font-black text-[16px] flex items-center justify-center gap-2 shadow-[0_4px_0_#B45309] active:shadow-none active:translate-y-1 transition-all"
                  >
                    <Zap size={20} fill="currentColor" />
                    TAP TO SPIN
                  </motion.button>
                )}

                {spinning && (
                  <div className="mt-6 text-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-[14px] font-bold text-[#FFD60A]"
                    >
                      Spinning...
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Bottom info */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-4 text-[11px] text-white/40">
                  <span className="flex items-center gap-1">
                    <Trophy size={12} className="text-[#FFD60A]" />
                    Jackpot: ₦50,000
                  </span>
                  <span>·</span>
                  <span>Resets in 4h 32m</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Celebration */}
      <AnimatePresence>
        {result && (
          <WinCelebration result={result} onClaim={claimReward} />
        )}
      </AnimatePresence>
    </div>
  );
}
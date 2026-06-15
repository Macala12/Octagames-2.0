"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Volume2, VolumeX, Zap } from "lucide-react";

// ─── Wheel Configuration ───────────────────────────────────────────────
const REWARDS = [
  { label: "$5", emoji: "💵", color: "#7C3AED", textColor: "#FFFFFF" },
  { label: "$500", emoji: "💰", color: "#FFD60A", textColor: "#1A0A00" },
  { label: "$20", emoji: "🎁", color: "#7C3AED", textColor: "#FFFFFF" },
  { label: "$1,000", emoji: "🏆", color: "#FFD60A", textColor: "#1A0A00" },
  { label: "$10", emoji: "⭐", color: "#7C3AED", textColor: "#FFFFFF" },
  { label: "$250", emoji: "💎", color: "#FFD60A", textColor: "#1A0A00" },
  { label: "$50", emoji: "🎯", color: "#7C3AED", textColor: "#FFFFFF" },
  { label: "$2,500", emoji: "🚀", color: "#FFD60A", textColor: "#1A0A00" },
];

const NUM = REWARDS.length;
const SLICE_DEG = 360 / NUM;

// ─── Confetti System ───────────────────────────────────────────────────
function ConfettiExplosion({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#FFD60A", "#FF6B6B", "#4ECDC4", "#A78BFA", "#7C3AED", "#FF8C42", "#22C55E", "#3B82F6"];

    const particles = Array.from({ length: 200 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 20;
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle" as const,
      };
    });

    let animationId: number;
    const gravity = 0.35;
    const friction = 0.985;
    const decay = 0.006;

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
        p.opacity -= decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.shape === "rect") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.fillRect(-p.size / 4, -p.size / 2, p.size / 2, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.restore();
      });

      if (alive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── Wheel SVG (Kept As-Is) ────────────────────────────────────────────
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function WheelSVG({ rotation }: { rotation: number }) {
  const cx = 200, cy = 200, r = 188, innerR = 36;

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      style={{ transform: `rotate(${rotation}deg)`, transition: "none", display: "block" }}
    >
      <circle cx={cx} cy={cy} r={r + 10} fill="#FFFFFF" stroke="#1A0A00" strokeWidth="6" />

      {REWARDS.map((reward, i) => {
        const startAngle = i * SLICE_DEG;
        const endAngle = startAngle + SLICE_DEG;
        const midAngle = startAngle + SLICE_DEG / 2;
        const p1 = polarToXY(cx, cy, r, startAngle);
        const p2 = polarToXY(cx, cy, r, endAngle);
        const ip1 = polarToXY(cx, cy, innerR, startAngle);
        const ip2 = polarToXY(cx, cy, innerR, endAngle);
        const labelPos = polarToXY(cx, cy, r * 0.62, midAngle);
        const emojiPos = polarToXY(cx, cy, r * 0.86, midAngle);
        const textRotate = midAngle;

        return (
          <g key={i}>
            <path
              d={`M ${ip1.x} ${ip1.y} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} L ${ip2.x} ${ip2.y} A ${innerR} ${innerR} 0 0 0 ${ip1.x} ${ip1.y} Z`}
              fill={reward.color}
              stroke="#1A0A00"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={reward.textColor}
              fontSize={reward.label.length > 4 ? "14" : "17"}
              fontWeight="800"
              transform={`rotate(${textRotate}, ${labelPos.x}, ${labelPos.y})`}
              style={{ letterSpacing: "-0.3px" }}
            >
              {reward.label}
            </text>
            <text
              x={emojiPos.x}
              y={emojiPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              transform={`rotate(${textRotate}, ${emojiPos.x}, ${emojiPos.y})`}
            >
              {reward.emoji}
            </text>
          </g>
        );
      })}

      {Array.from({ length: NUM }).map((_, i) => {
        const pos = polarToXY(cx, cy, r + 10, i * (360 / NUM));
        return (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r="6"
            fill="#FFFFFF"
            stroke="#1A0A00"
            strokeWidth="3"
          />
        );
      })}

      <circle cx={cx} cy={cy} r={innerR + 4} fill="#FFFFFF" stroke="#1A0A00" strokeWidth="6" />
      <circle cx={cx} cy={cy} r={innerR - 6} fill="#F5C518" stroke="#1A0A00" strokeWidth="3" />
    </svg>
  );
}

function Pointer() {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
      <svg width="36" height="52" viewBox="0 0 36 52">
        <polygon points="18,46 4,6 32,6" fill="#7C3AED" stroke="#1A0A00" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="18" cy="9" r="6" fill="#FFFFFF" stroke="#1A0A00" strokeWidth="3" />
      </svg>
    </div>
  );
}

// ─── Original Win UI (Inline, Not Modal) ────────────────────────────────
function WinCard({ reward, onClaim, onSpin }: { 
  reward: typeof REWARDS[0]; 
  onClaim: () => void; 
  onSpin: () => void; 
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{
        minHeight: 520,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.88) translateY(24px)",
        transition: "opacity 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div className="relative w-full flex flex-col items-center gap-0" style={{ borderRadius: 28 }}>
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #FFD70088, transparent)",
            borderRadius: "28px 28px 0 0",
          }}
        />

        <p className="text-[11px] font-bold text-gray-900 tracking-[3px] uppercase m-0 mb-7">
          You've Won
        </p>

        {/* Emoji with glow rings */}
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
          <div
            className="absolute inset-[-24px] rounded-full"
            style={{
              background: "radial-gradient(circle, #FFD70022 0%, #C0182A18 45%, transparent 70%)",
              animation: "pulse 2.4s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-[-12px] rounded-full"
            style={{
              background: "radial-gradient(circle, #F5C51833 0%, transparent 65%)",
              animation: "pulse 2.4s ease-in-out infinite 0.4s",
            }}
          />
          <div className="relative z-10 text-[72px]">{reward.emoji}</div>
        </div>

        {/* Amount */}
        <p className="text-[56px] font-black m-0 mb-1 leading-none tracking-[-2px]" style={{ color: "#7C3AED" }}>
          {reward.label}
        </p>

        {/* Description */}
        <p className="text-[14px] text-gray-900 font-normal m-0 mt-4 mb-7 tracking-[1px] text-center px-3">
          Congratulations, you've won <strong className="text-[#1A0A00]">{reward.label}</strong>! Your prize has been added to your account and is ready to claim right now.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onSpin}
            className="w-full py-3.5 rounded-[14px] text-[14px] font-semibold tracking-[0.3px] cursor-pointer transition-all duration-150 border"
            style={{
              background: "transparent",
              color: "#C8920A",
              borderColor: "#8B1A1A",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#F5C518"; e.currentTarget.style.color = "#F5C518"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#8B1A1A"; e.currentTarget.style.color = "#C8920A"; }}
          >
            Spin Again
          </button>

          <button
            onClick={onClaim}
            className="w-full py-4 rounded-[14px] text-[16px] font-extrabold tracking-[0.5px] cursor-pointer transition-all duration-150 border-none"
            style={{
              backgroundColor: "#7C3AED",
              color: "#fff",
              boxShadow: "0 4px 24px #F5C51844, 0 1px 0 #FFE56688 inset",
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.transform = "translateY(-1px)"; 
              e.currentTarget.style.boxShadow = "0 8px 32px #F5C51866, 0 1px 0 #FFE56688 inset"; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.transform = ""; 
              e.currentTarget.style.boxShadow = "0 4px 24px #F5C51844, 0 1px 0 #FFE56688 inset"; 
            }}
          >
            Claim Reward
          </button>
        </div>

        {/* Bottom dots */}
        <div className="absolute bottom-5 flex gap-1 opacity-30">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#F5C518]" />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────
export default function SpinWheel() {
  const [phase, setPhase] = useState<"idle" | "spinning" | "won">("idle");
  const [rotation, setRotation] = useState(0);
  const [winIndex, setWinIndex] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentRotation = useRef(0);
  const animRef = useRef<number | null>(null);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);

  const spin = useCallback(() => {
    if (phase === "spinning") return;
    setPhase("spinning");
    setShowConfetti(false);

    const winIdx = Math.floor(Math.random() * NUM);
    setWinIndex(winIdx);

    const minSpins = 6;
    const extraSpins = Math.floor(Math.random() * 4) * 360;
    const sliceCenter = winIdx * SLICE_DEG + SLICE_DEG / 2;
    const targetAngle = 360 - sliceCenter;
    const normalizedCurrent = ((currentRotation.current % 360) + 360) % 360;
    const delta = ((targetAngle - normalizedCurrent + 360) % 360) || 360;
    const totalRotation = minSpins * 360 + extraSpins + delta;

    const startRot = currentRotation.current;
    const targetRot = currentRotation.current + totalRotation;
    const duration = 4200 + Math.random() * 800;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const current = startRot + (targetRot - startRot) * eased;
      currentRotation.current = current;
      setRotation(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        currentRotation.current = targetRot;
        setRotation(targetRot);
        setTimeout(() => {
          setPhase("won");
          setShowConfetti(true);
        }, 400);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [phase]);

  const resetWheel = () => {
    setPhase("idle");
    setWinIndex(null);
    setShowConfetti(false);
  };

  const claimReward = () => {
    resetWheel();
  };

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const reward = winIndex !== null ? REWARDS[winIndex] : null;

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Confetti */}
      <ConfettiExplosion active={showConfetti} />

      {/* Subtle background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #7C3AED 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main content area */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase !== "won" && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="flex flex-col items-center w-full"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full px-4 py-1.5 mb-4"
                >
                  <Sparkles size={14} className="text-[#7C3AED]" />
                  <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">Daily Spin</span>
                </motion.div>

                <h1 className="text-[36px] font-black text-gray-900 leading-none tracking-tight mb-2">
                  Spin & Win
                </h1>
                <p className="text-[13px] text-[#7C3AED] font-bold uppercase tracking-[2px]">
                  Your prize awaits
                </p>
              </div>

              {/* Wheel */}
              <div className="relative mb-10">
                <div className="absolute inset-[-20px] rounded-full pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/10" style={{ boxShadow: "0 0 40px rgba(124,58,237,0.08)" }} />
                </div>

                <div className="relative w-[310px] h-[310px]">
                  <Pointer />
                  <div className="w-full h-full rounded-full" style={{ filter: "drop-shadow(0 8px 32px rgba(124,58,237,0.15))" }}>
                    <WheelSVG rotation={rotation} />
                  </div>
                </div>

                {phase === "spinning" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ margin: -20 }}
                  />
                )}
              </div>

              {/* Spin button */}
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={spin}
                  disabled={phase === "spinning"}
                  className={`
                    flex items-center gap-3 px-12 py-4 rounded-2xl text-[17px] font-black tracking-wide
                    transition-all duration-200
                    ${phase === "spinning"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#7C3AED] text-white shadow-[0_4px_0_#5B21B6,0_8px_32px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_0_#5B21B6,0_12px_40px_rgba(124,58,237,0.4)] active:shadow-none active:translate-y-1"
                    }
                  `}
                >
                  {phase === "spinning" ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Zap size={20} />
                      </motion.div>
                      SPINNING...
                    </>
                  ) : (
                    <>
                      <Zap size={20} fill="currentColor" />
                      SPIN NOW
                    </>
                  )}
                </motion.button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button className="text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300">
                    History
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "won" && reward && (
            <motion.div
              key="win"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full"
            >
              <WinCard
                reward={reward}
                onClaim={claimReward}
                onSpin={resetWheel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
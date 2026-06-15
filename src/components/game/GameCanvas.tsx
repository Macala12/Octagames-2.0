import { useEffect, useRef, useState, useCallback } from "react";

type GameCanvasProps = {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  gameTitle?: string;
  opponentName?: string;
  sessionId?: string;
  wager?: number;
};

const ACCENT      = "#7C3AED";
const ACCENT_TEXT = "#022b1e";

// ─── Inject keyframes once ────────────────────────────────────────────────────
const CSS = `
  @keyframes slideUp    { from { transform: translateY(100%) } to { transform: translateY(0) } }
  @keyframes gcSpin     { to   { transform: rotate(360deg) } }
  @keyframes gcPulse    { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
  @keyframes gcFadeIn   { from { opacity: 0 } to { opacity: 1 } }
  @keyframes gcScaleIn  { from { opacity: 0; transform: scale(0.88) } to { opacity: 1; transform: scale(1) } }
  @keyframes gcScore    { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes gcLive     { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.5; transform: scale(0.8) } }
  @keyframes gcConfetti { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1 }
                          100% { transform: translateY(110vh) rotate(720deg); opacity: 0 } }
`;

function injectCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("game-canvas-css")) return;
  const s = document.createElement("style");
  s.id = "game-canvas-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const cols = ["#09f2a6","#FBBF24","#fff","#A78BFA","#38BDF8","#fde68a"];
    const size = 3 + (i % 5);
    return {
      left:     `${5 + (i * 3.8) % 90}%`,
      size,
      color:    cols[i % cols.length],
      radius:   i % 3 === 0 ? "50%" : "2px",
      duration: 1.5 + (i % 3) * 0.5,
      delay:    (i * 0.025) % 0.6,
    };
  });
  return (
    <>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: "absolute", top: -8, left: p.left,
          width: p.size, height: p.size,
          background: p.color, borderRadius: p.radius,
          opacity: 0.85, pointerEvents: "none",
          animation: `gcConfetti ${p.duration}s ease forwards`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen({ title }: { title: string }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 5,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ position: "relative" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `3px solid rgba(9,242,166,0.15)`,
          borderTopColor: ACCENT,
          animation: "gcSpin 0.9s linear infinite",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", fontSize: 26,
        }}></div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Loading Game...</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{title}</p>
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: ACCENT,
            animation: `gcPulse 1.2s ease-in-out infinite`,
            animationDelay: `${d}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Exit modal ───────────────────────────────────────────────────────────────
function ExitModal({ wager, onCancel, onConfirm }: {
  wager?: number; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "gcFadeIn 0.2s ease",
    }}>
      <div style={{
        width: 280, borderRadius: 24, background: "#0d1117",
        border: "0.5px solid rgba(255,255,255,0.1)", overflow: "hidden",
        animation: "gcScaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ padding: "24px 20px 16px", textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", margin: "0 auto 12px",
            background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Exit Game?</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Leaving will forfeit this match
            {wager ? <> and your wager of <span style={{ color: "#FBBF24", fontWeight: 700 }}>🪙 {wager}</span></> : ""}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "0 20px 20px" }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 13, cursor: "pointer", fontFamily: "inherit",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)",
            border: "0.5px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 700,
          }}>
            Keep Playing
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: 13, cursor: "pointer", fontFamily: "inherit",
            background: "rgba(239,68,68,0.12)", color: "#EF4444",
            border: "0.5px solid rgba(239,68,68,0.25)", fontSize: 13, fontWeight: 700,
          }}>
            Exit Match
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────
function ResultScreen({ myScore, opponentScore, opponentName, wager, onHome, onPlayAgain }: {
  myScore: number; opponentScore: number; opponentName: string;
  wager?: number; onHome: () => void; onPlayAgain: () => void;
}) {
  const won      = myScore > opponentScore;
  const winnings = wager ? Math.floor(wager * 1.9) : null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20,
      background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 20,
      animation: "gcFadeIn 0.3s ease", overflow: "hidden",
    }}>
      {won && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <Confetti />
        </div>
      )}

      <div style={{
        width: "100%", maxWidth: 300, borderRadius: 24, background: "#0d1117",
        border: "0.5px solid rgba(255,255,255,0.1)", overflow: "hidden",
        animation: "gcScaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 20px 16px", textAlign: "center",
          background: won ? "linear-gradient(180deg,rgba(9,242,166,0.1),transparent)"
                          : "linear-gradient(180deg,rgba(239,68,68,0.08),transparent)",
        }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>{won ? "🏆" : "😤"}</div>
          <p style={{ fontSize: 20, fontWeight: 800, color: won ? ACCENT : "#EF4444", marginBottom: 2 }}>
            {won ? "You Won!" : "You Lost!"}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Match complete</p>
        </div>

        {/* Scores */}
        <div style={{
          padding: "16px 20px",
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
              Your Score
            </p>
            <p style={{ fontSize: 26, fontWeight: 800, color: won ? ACCENT : "#fff", animation: "gcScore 0.5s ease" }}>
              {myScore.toLocaleString()}
            </p>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.25)" }}>vs</p>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
              {opponentName}
            </p>
            <p style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.5)", animation: "gcScore 0.5s ease 0.1s both" }}>
              {opponentScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Wager result */}
        {wager && (
          <div style={{
            padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: won ? "rgba(9,242,166,0.05)" : "rgba(239,68,68,0.05)",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              {won ? "Winnings" : "Lost"}
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: won ? ACCENT : "#EF4444" }}>
              {won ? `+🪙 ${winnings?.toLocaleString()}` : `-🪙 ${wager}`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, padding: 16 }}>
          <button onClick={onHome} style={{
            flex: 1, padding: 12, borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
            border: "0.5px solid rgba(255,255,255,0.08)", fontSize: 13, fontWeight: 700,
          }}>
            Home
          </button>
          <button onClick={onPlayAgain} style={{
            flex: 2, padding: 12, borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
            background: ACCENT, color: ACCENT_TEXT, border: "none",
            fontSize: 13, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.45"/>
            </svg>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GameCanvas({
  isOpen, onClose, gameUrl, gameTitle = "Game",
  opponentName = "Opponent", sessionId, wager,
}: GameCanvasProps) {
  injectCSS();

  const [loading,         setLoading]         = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [gameEnded,       setGameEnded]       = useState(false);
  const [myScore,         setMyScore]         = useState<number>(0);
  const [oppScore,        setOppScore]        = useState<number>(0);
  const [liveMyScore,     setLiveMyScore]     = useState<number>(0);
  const [liveOppScore,    setLiveOppScore]    = useState<number>(0);
  const [timeProgress,    setTimeProgress]    = useState(100); // 100% → 0%

  const iframeRef   = useRef<HTMLIFrameElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setGameEnded(false);
      setMyScore(0);
      setOppScore(0);
      setLiveMyScore(0);
      setLiveOppScore(0);
      setTimeProgress(100);
      setShowExitConfirm(false);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || loading || gameEnded) return;
    const DURATION_MS = 120_000; // 2 min match
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / DURATION_MS) * 100;
      setTimeProgress(remaining);
      if (remaining <= 0 && timerRef.current) clearInterval(timerRef.current);
    }, 500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isOpen, loading, gameEnded]);

  // Game messages from iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data) return;
      const { type, payload } = e.data as { type: string; payload?: Record<string, number> };
      if (type === "GAME_READY")    { setLoading(false); }
      if (type === "SCORE_UPDATE")  { setLiveMyScore(payload?.myScore ?? 0); setLiveOppScore(payload?.oppScore ?? 0); }
      if (type === "GAME_END")      { setGameEnded(true); setMyScore(payload?.myScore ?? 0); setOppScore(payload?.oppScore ?? 0); if (timerRef.current) clearInterval(timerRef.current); }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleClose = useCallback(() => setShowExitConfirm(true), []);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    setGameEnded(false);
    setLoading(true);
    onClose();
  }, [onClose]);

  const timerColor = timeProgress > 40 ? ACCENT : timeProgress > 20 ? "#FBBF24" : "#EF4444";

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        width: "100%", maxWidth: 480, height: "99%", background: "#7c3aed",
        borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.35s cubic-bezier(0.32,0.72,0,1)",
      }}>

        {/* ── Top bar ── */}
        <div style={{
          height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 14px",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)", flexShrink: 0, position: "relative", zIndex: 10,
        }} className="bg-white/5">
          {/* Left: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={handleClose} style={{
              width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
              background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{gameTitle}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>vs {opponentName}</p>
            </div>
          </div>

          {/* Center: live score */}
          {!loading && !gameEnded && (
            <div style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>You</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: ACCENT, lineHeight: 1 }}>
                  {liveMyScore.toLocaleString()}
                </p>
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)" }}>:</p>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{opponentName.split(" ")[0]}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.65)", lineHeight: 1 }}>
                  {liveOppScore.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Right: live badge + wager */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!loading && !gameEnded && (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(239,68,68,0.12)", border: "0.5px solid rgba(239,68,68,0.25)",
                borderRadius: 20, padding: "4px 10px",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "gcLive 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444" }}>LIVE</span>
              </div>
            )}
            {/* {wager && (
              <div style={{
                background: "rgba(9,242,166,0.1)", border: "0.5px solid rgba(9,242,166,0.2)",
                borderRadius: 20, padding: "4px 10px",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT }}>🪙 {wager}</span>
              </div>
            )} */}
          </div>
        </div>

        {/* ── Game area ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {loading && <LoadingScreen title={gameTitle} />}

          <iframe
            ref={iframeRef}
            src={gameUrl}
            title={gameTitle}
            style={{
              width: "100%", height: "100%", border: "none",
              opacity: loading ? 0 : 1, transition: "opacity 0.3s ease",
            }}
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />

          {showExitConfirm && !gameEnded && (
            <ExitModal wager={wager} onCancel={() => setShowExitConfirm(false)} onConfirm={confirmExit} />
          )}

          {gameEnded && (
            <ResultScreen
              myScore={myScore} opponentScore={oppScore}
              opponentName={opponentName} wager={wager}
              onHome={confirmExit} onPlayAgain={confirmExit}
            />
          )}
        </div>

        {/* ── Timer bar ── */}
        {!loading && !gameEnded && (
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <div style={{
              height: "100%", borderRadius: "0 2px 2px 0",
              background: `linear-gradient(90deg, ${timerColor}, ${timerColor}cc)`,
              width: `${timeProgress}%`, transition: "width 0.5s linear, background 0.5s",
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
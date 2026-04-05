import React, { useEffect, useRef, useState } from "react";

type GameCanvasProps = {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  gameTitle?: string;
  sessionId?: string;
  wager?: number;
};

export default function GameCanvas({
  isOpen,
  onClose,
  gameUrl,
  gameTitle = "Game",
//   sessionId,
  wager,
}: GameCanvasProps) {
  const [loading, setLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Slide + lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Listen for messages from game
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check (you can tighten this later)
      if (!event.data) return;

      const { type, payload } = event.data;

      switch (type) {
        case "GAME_READY":
          setLoading(false);
          break;

        case "SCORE_UPDATE":
          setScore(payload?.score);
          break;

        case "GAME_END":
          setGameEnded(true);
          setScore(payload?.score);
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setGameEnded(false);
    setScore(null);
    setLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.canvas}>
        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div style={styles.leftInfo}>
            <div style={styles.title}>{gameTitle}</div>
            {wager && <div style={styles.wager}>₦{wager}</div>}
          </div>

          <div style={styles.rightControls}>
            {!gameEnded && <div style={styles.timer}>⏱ Live</div>}
            <button style={styles.closeBtn} onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>

        {/* GAME AREA */}
        <div style={styles.gameContainer}>
          {loading && (
            <div style={styles.loader}>
              <div className="spinner" />
              <p>Loading Game...</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={gameUrl}
            style={{
              ...styles.iframe,
              opacity: loading ? 0 : 1,
            }}
            allow="autoplay; fullscreen"
          />
        </div>

        {/* RESULT OVERLAY */}
        {gameEnded && (
          <div style={styles.resultOverlay}>
            <div style={styles.resultCard}>
              <h2>Game Over 🎮</h2>
              <p>Score: {score ?? 0}</p>

              {wager && (
                <p style={{ marginTop: 8 }}>
                  Wager: ₦{wager}
                </p>
              )}

              <button style={styles.primaryBtn} onClick={confirmExit}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* EXIT CONFIRM MODAL */}
        {showExitConfirm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Exit Game?</h3>
              <p>
                Leaving will forfeit this match.
              </p>

              <div style={styles.modalActions}>
                <button onClick={() => setShowExitConfirm(false)}>
                  Cancel
                </button>
                <button style={styles.dangerBtn} onClick={confirmExit}>
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 9999,
  },

  canvas: {
    width: "100%",
    height: "100%",
    background: "#0b0f14",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.35s ease-out",
  },

  topBar: {
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  leftInfo: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    color: "#fff",
    fontWeight: 600,
  },

  wager: {
    color: "#22c55e",
    fontSize: 12,
  },

  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  timer: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },

  closeBtn: {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
  },

  gameContainer: {
    flex: 1,
    position: "relative",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    transition: "opacity 0.3s ease",
  },

  loader: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  resultOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  resultCard: {
    background: "#111827",
    padding: 24,
    borderRadius: 16,
    textAlign: "center",
    color: "#fff",
  },

  primaryBtn: {
    marginTop: 16,
    padding: "10px 16px",
    background: "#22c55e",
    border: "none",
    borderRadius: 8,
    color: "#000",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "#111827",
    padding: 20,
    borderRadius: 12,
    color: "#fff",
    width: 280,
    textAlign: "center",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },

  dangerBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

/* ANIMATION */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
`, styleSheet.cssRules.length);
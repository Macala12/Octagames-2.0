import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type CardColor = "#7C3AED" | "#7C3AED" | string;

interface NeubrutalistCardProps {
  // Color control
  mainColor?: CardColor;
  shadowColor?: CardColor;

  // Layout
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Shadow offset
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Border
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;

  // Interaction
  onClick?: () => void;
  hoverable?: boolean;
  pressable?: boolean;

  // Padding
  padding?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NeubrutalistCard({
  mainColor = "#7C3AED",
  shadowColor = "#7C3AED",
  children,
  className = "",
  style = {},
  shadowOffsetX = 4,
  shadowOffsetY = 4,
  borderWidth = 2,
  borderColor = "#111",
  borderRadius = 15,
  onClick,
  hoverable = false,
  pressable = false,
  padding = "0px",
}: NeubrutalistCardProps) {
  const [pressed, setPressed] = React.useState(false);

  const isInteractive = hoverable || pressable || !!onClick;

  // When pressed: card shifts toward shadow, shadow shrinks
  const translateX = pressed ? shadowOffsetX * 0.75 : 0;
  const translateY = pressed ? shadowOffsetY * 0.75 : 0;
  const activeShadowX = pressed ? shadowOffsetX * 0.25 : shadowOffsetX;
  const activeShadowY = pressed ? shadowOffsetY * 0.25 : shadowOffsetY;

  return (
    <div
      style={{
        // Outer wrapper holds the shadow space so layout doesn't shift
        paddingRight: shadowOffsetX,
        paddingBottom: shadowOffsetY,
        display: "inline-block",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: "15px"
      }}
    >
      <div
        onClick={onClick}
        onMouseDown={() => pressable && setPressed(true)}
        onMouseUp={() => pressable && setPressed(false)}
        onTouchStart={() => pressable && setPressed(true)}
        onTouchEnd={() => pressable && setPressed(false)}
        className={className}
        style={{
          position: "relative",
          background: mainColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: borderRadius,
          padding: padding,
          cursor: isInteractive ? "pointer" : "default",
          boxShadow: `${activeShadowX}px ${activeShadowY}px 0px 0px ${shadowColor}, ${activeShadowX}px ${activeShadowY}px 0px ${borderWidth}px ${borderColor}`,
          transform: `translate(${translateX}px, ${translateY}px)`,
          transition: pressable
            ? "transform 0.1s ease, box-shadow 0.1s ease"
            : hoverable
            ? "transform 0.15s ease, box-shadow 0.15s ease"
            : "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          boxSizing: "border-box",
          width: "100%",
          ...style,
        }}
        onMouseEnter={
          hoverable && !pressable
            ? (e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = `translate(${shadowOffsetX * 0.5}px, ${shadowOffsetY * 0.5}px)`;
                el.style.boxShadow = `${shadowOffsetX * 0.5}px ${shadowOffsetY * 0.5}px 0px 0px ${shadowColor}, ${shadowOffsetX * 0.5}px ${shadowOffsetY * 0.5}px 0px ${borderWidth}px ${borderColor}`;
              }
            : undefined
        }
        onMouseLeave={
          (e) => {
            // Clear pressed state when leaving
            if (pressable) setPressed(false);
            // Reset hover styles if hoverable and not pressable
            if (hoverable && !pressable) {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translate(0,0)";
              el.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px 0px 0px ${shadowColor}, ${shadowOffsetX}px ${shadowOffsetY}px 0px ${borderWidth}px ${borderColor}`;
            }
          }
        }
      >
        {children}
      </div>
    </div>
  );
}

// ─── Demo (delete when integrating) ──────────────────────────────────────────
// export default function Demo() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f5f0e8",
//         padding: "32px 20px",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: 13,
//           fontWeight: 900,
//           letterSpacing: "0.2em",
//           textTransform: "uppercase",
//           color: "#111",
//           marginBottom: 32,
//         }}
//       >
//         NeubrutalistCard — Usage Examples
//       </h1>

//       <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 400 }}>

//         {/* 1. Yellow card, purple shadow */}
//         <NeubrutalistCard
//           mainColor="#7C3AED"
//           shadowColor="#7C3AED"
//           pressable
//           shadowOffsetX={5}
//           shadowOffsetY={5}
//         >
//           <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>
//             Tournament · Live
//           </p>
//           <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: 0 }}>8 Ball Pool</h2>
//           <p style={{ fontSize: 13, color: "#333", marginTop: 6 }}>Prize Pool: ₦50,000</p>
//         </NeubrutalistCard>

//         {/* 2. Purple card, yellow shadow */}
//         <NeubrutalistCard
//           mainColor="#7C3AED"
//           shadowColor="#7C3AED"
//           pressable
//           shadowOffsetX={5}
//           shadowOffsetY={5}
//         >
//           <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
//             Tournament · Live
//           </p>
//           <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>Tower Master</h2>
//           <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>Prize Pool: ₦50,000</p>
//         </NeubrutalistCard>

//         {/* 3. White card, yellow shadow — stat card */}
//         <NeubrutalistCard
//           mainColor="#fff"
//           shadowColor="#7C3AED"
//           hoverable
//           shadowOffsetX={4}
//           shadowOffsetY={4}
//           padding="16px 20px"
//         >
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", margin: 0 }}>Your Rank</p>
//               <p style={{ fontSize: 36, fontWeight: 900, color: "#111", margin: 0, lineHeight: 1 }}>#4</p>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", margin: 0 }}>Score</p>
//               <p style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: 0 }}>5,120</p>
//               <p style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>Top: 8,450</p>
//             </div>
//           </div>
//         </NeubrutalistCard>

//         {/* 4. Black card, purple shadow — dark variant */}
//         <NeubrutalistCard
//           mainColor="#111"
//           shadowColor="#7C3AED"
//           pressable
//           shadowOffsetX={6}
//           shadowOffsetY={6}
//           borderRadius={12}
//         >
//           <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
//             Winners · Marquee
//           </p>
//           <p style={{ fontSize: 15, fontWeight: 900, color: "#7C3AED", margin: 0 }}>queenBee won ₦8,000</p>
//           <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>eFootball · 10 mins ago</p>
//         </NeubrutalistCard>

//         {/* 5. Big shadow, no radius */}
//         <NeubrutalistCard
//           mainColor="#7C3AED"
//           shadowColor="#111"
//           shadowOffsetX={8}
//           shadowOffsetY={8}
//           borderRadius={0}
//           pressable
//           padding="24px"
//         >
//           <p style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: 0 }}>Top Players</p>
//           <p style={{ fontSize: 12, color: "#444", marginTop: 4 }}>Africa Leaderboard · Live</p>
//         </NeubrutalistCard>

//       </div>
//     </div>
//   );
// }
import { Link } from "react-router";

const ACCENT = "#7C3AED";

const options = [
  // {
  //   title: "Wallet Balance",
  //   sub: "Instant · No fees",
  //   path: "/pay-wallet",
  //   accentColor: "#7C3AED",
  //   badge: null,
  //   recommended: true,
  //   // logo: <img src="/logos/wallet.png" alt="Wallet" className="w-6 h-6 object-contain" />
  //   logo: (
  //     <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
  //       <rect x="1" y="5" width="20" height="14" rx="3" stroke="#7C3AED" strokeWidth="1.6"/>
  //       <path d="M1 9h20" stroke="#7C3AED" strokeWidth="1.6"/>
  //       <circle cx="15.5" cy="14" r="1.5" fill="#7C3AED"/>
  //     </svg>
  //   ),
  // },
  {
    title: "Paystack",
    sub: "Cards · Bank transfer",
    path: "/pay-paystack",
    accentColor: "#38BDF8",
    badge: "+20 coins free",
    recommended: false,
    // logo: <img src="/logos/paystack.png" alt="Paystack" className="w-6 h-6 object-contain" />
    logo: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="3.5" rx="1.75" fill="#38BDF8"/>
        <rect x="3" y="10.5" width="12" height="3.5" rx="1.75" fill="#38BDF8" opacity="0.6"/>
        <rect x="3" y="16" width="8" height="3.5" rx="1.75" fill="#38BDF8" opacity="0.3"/>
      </svg>
    ),
  },
  {
    title: "Flutterwave",
    sub: "Cards · USSD · More",
    path: "/pay-flutterwave",
    accentColor: "#FBBF24",
    badge: "+20 coins free",
    recommended: false,
    // logo: <img src="/logos/flutterwave.png" alt="Flutterwave" className="w-6 h-6 object-contain" />
    logo: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 16C7 10 10 7 17 6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 11C7 7 11 5 17 6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
        <path d="M5 6C8 4 13 4 17 6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.25"/>
      </svg>
    ),
  },
];

export default function PaymentOptions({ pack }: { pack?: { coins: number; price: number } | null }) {
  return (
    <div>

      {/* Amount summary */}
      {pack && (
        <div
          style={{
            borderRadius: 16,
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#000", margin: 0, letterSpacing: "-0.3px" }}>
              {pack.coins.toLocaleString()}
              <span style={{ fontSize: 14, fontWeight: 500, color: "#909090da", marginLeft: 4 }}>
                coins
              </span>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#909090da", margin: "0 0 2px", fontWeight: 500 }}>
              Total
            </p>
            <p style={{ fontSize: 20, fontWeight: 900, color: ACCENT, margin: 0, letterSpacing: "-0.5px" }}>
              ₦{pack.price.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Options label */}
      <p style={{ fontSize: 11, fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 10px 2px" }}>
        Pay with
      </p>

      {/* Option rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => (
          <Link
            key={opt.title}
            to={opt.path}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 0,
                backgroundColor: "transparent",
                border: opt.recommended
                  ? "1.5px solid rgba(167,139,250,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "transform 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(0.985)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
            >
              {/* Left color bleed */}
              <div style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 3,
                background: opt.accentColor,
                borderRadius: "18px 0 0 18px",
              }} />

              {/* Subtle glow */}
              <div style={{
                position: "absolute",
                left: -20, top: "50%",
                transform: "translateY(-50%)",
                width: 80, height: 80,
                borderRadius: "50%",
                background: opt.accentColor,
                opacity: 0.06,
                filter: "blur(20px)",
                pointerEvents: "none",
              }} />

              {/* Dot pattern */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                viewBox="0 0 300 72"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern id={`dots-${opt.title}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.65" fill="rgba(255,255,255,0.04)" />
                  </pattern>
                </defs>
                <rect width="300" height="72" fill={`url(#dots-${opt.title})`} />
              </svg>

              {/* Logo tile */}
              <div
                style={{
                  position: "relative",
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: opt.accentColor + "18",
                  border: `1px solid ${opt.accentColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {opt.logo}
              </div>

              {/* Text */}
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#000", margin: 0, letterSpacing: "-0.2px" }}>
                    {opt.title}
                  </p>
                  {opt.recommended && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: ACCENT,
                      background: "rgba(9,242,166,0.12)",
                      border: "0.5px solid rgba(9,242,166,0.3)",
                      borderRadius: 99,
                      padding: "2px 7px",
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                    }}>
                      Recommended
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#82828278", margin: 0, fontWeight: 500 }}>
                  {opt.sub}
                </p>

                {/* Bonus badge inline under subtitle */}
                {opt.badge && (
                  <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: ACCENT,
                      background: "rgba(9,242,166,0.1)",
                      border: "0.5px solid rgba(9,242,166,0.25)",
                      borderRadius: 99,
                      padding: "2px 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      🪙 {opt.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Chevron */}
              <div
                style={{
                  position: "relative",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#82828278",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L8 6L4.5 9.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "rgba(0,0,0,0.3)",
        marginTop: 20,
        fontWeight: 500,
      }}>
        🔒 Secured & encrypted payments
      </p>
    </div>
  );
}
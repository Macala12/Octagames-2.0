import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import PaymentOptions from "../../components/ui/bottom-sheet/OctacoinSheet";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT        = "#7C3AED";
const DISCOUNT_RATE = 0.2; // 20% off
const currency      = "₦";

// Valid coupon codes (replace with backend call later)
const VALID_COUPONS: Record<string, string> = {
  OCTA20:  "20% off applied!",
  WELCOME: "20% off applied!",
  PLAY20:  "20% off applied!",
};

// Saved coupons for the current user (replace with real data)
const USER_SAVED_COUPONS = ["OCTA20", "WELCOME"];

const CoinIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#FFD60A" />
    <circle cx="20" cy="20" r="15" fill="#F59E0B" />
    <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="#92400E">G</text>
  </svg>
);

// ─── Pack data ────────────────────────────────────────────────────────────────
interface Pack {
  id: string;
  coins: number;
  price: number;
  bonus?: string;
  best_value?: boolean;
}

const ALL_PACKS: Pack[] = [
  { id: "1", coins: 100,    price: 500   },
  { id: "2", coins: 300,    price: 1000  },
  { id: "3", coins: 700,    price: 2000,  bonus: "+50 free"    },
  { id: "4", coins: 1500,   price: 4000,  bonus: "+200 free",  best_value: true },
  { id: "5", coins: 3500,   price: 8000,  bonus: "+500 free"   },
  { id: "6", coins: 7000,   price: 15000  },
  { id: "7", coins: 15000,  price: 28000, bonus: "+2k free"    },
  { id: "8", coins: 50000,  price: 80000, bonus: "+10k free"   },
  { id: "9", coins: 100000, price: 150000 },
];

// ─── Coupon Section ───────────────────────────────────────────────────────────
interface CouponSectionProps {
  onApply: (valid: boolean) => void;
}

function CouponSection({ onApply }: CouponSectionProps) {
  const [code, setCode]           = useState("");
  const [status, setStatus]       = useState<"idle" | "valid" | "invalid">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [applied, setApplied]     = useState(false);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (VALID_COUPONS[trimmed]) {
      setStatus("valid");
      setStatusMsg(`🎉 ${VALID_COUPONS[trimmed]}`);
      setApplied(true);
      onApply(true);
    } else {
      setStatus("invalid");
      setStatusMsg("Invalid coupon code. Please try again.");
      setApplied(false);
      onApply(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setStatus("idle");
    setStatusMsg("");
    setApplied(false);
    onApply(false);
  };

  const handlePillClick = (c: string) => {
    setCode(c);
    setStatus("idle");
    setStatusMsg("");
    setApplied(false);
    onApply(false);
  };

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1.5px dashed ${applied ? ACCENT : "#D4D4D8"}`,
        background: applied ? "rgba(124,58,237,0.03)" : "#FAFAFA",
        padding: "14px 14px 12px",
        marginBottom: 20,
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
      }}
    >
      {/* Ticket notch decorations */}
      <div style={{
        position: "absolute", left: -1, top: "50%", transform: "translateY(-50%)",
        width: 12, height: 12, borderRadius: "50%",
        background: "#fff", border: "1.5px dashed #D4D4D8",
        marginLeft: -6,
      }} />
      <div style={{
        position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)",
        width: 12, height: 12, borderRadius: "50%",
        background: "#fff", border: "1.5px dashed #D4D4D8",
        marginRight: -6,
      }} />

      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M8.5 1L13 5.5L5.5 13L1 8.5L8.5 1Z" stroke={ACCENT} strokeWidth="1.4" strokeLinejoin="round"/>
          <circle cx="4.5" cy="9.5" r="1" fill={ACCENT}/>
        </svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#3F3F46", letterSpacing: "0.1px" }}>
          Coupon code
        </span>
        {applied && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#fff",
            background: "#16A34A", borderRadius: 99, padding: "2px 8px", marginLeft: "auto",
          }}>
            Applied ✓
          </span>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "#fff",
          border: status === "invalid" ? "1.5px solid #EF4444"
                : status === "valid"   ? "1.5px solid #16A34A"
                : "1.5px solid #E4E4E7",
          borderRadius: 10,
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (status !== "idle") { setStatus("idle"); setStatusMsg(""); }
              if (applied) { setApplied(false); onApply(false); }
            }}
            placeholder="Enter code"
            maxLength={20}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              padding: "0 12px",
              height: 42,
              fontSize: 13,
              fontWeight: 600,
              color: "#18181B",
              outline: "none",
              letterSpacing: "1px",
              fontFamily: "system-ui, monospace",
            }}
          />
          {code.length > 0 && (
            <button
              onClick={handleRemove}
              style={{
                background: "none", border: "none", padding: "0 10px",
                cursor: "pointer", color: "#A1A1AA", display: "flex", alignItems: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={code.trim().length === 0}
          style={{
            padding: "0 16px",
            height: 42,
            borderRadius: 10,
            border: "none",
            background: code.trim().length === 0 ? "#E4E4E7" : ACCENT,
            color: code.trim().length === 0 ? "#A1A1AA" : "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: code.trim().length === 0 ? "not-allowed" : "pointer",
            transition: "background 0.15s, color 0.15s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Apply
        </button>
      </div>

      {/* Status text */}
      {statusMsg && (
        <p style={{
          fontSize: 11,
          fontWeight: 500,
          color: status === "valid" ? "#16A34A" : "#EF4444",
          margin: "6px 0 0 2px",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          {statusMsg}
        </p>
      )}

      {/* Saved coupons */}
      {USER_SAVED_COUPONS.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#A1A1AA", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Your coupons
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {USER_SAVED_COUPONS.map((c) => (
              <button
                key={c}
                onClick={() => handlePillClick(c)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1.5px dashed ${code === c ? ACCENT : "#C4B5FD"}`,
                  background: code === c ? "rgba(124,58,237,0.06)" : "#fff",
                  color: code === c ? ACCENT : "#7C3AED",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "1px",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pack Card ────────────────────────────────────────────────────────────────
function PackCard({ pack, discounted, onSelect }: {
  pack: Pack;
  discounted: boolean;
  onSelect: (p: Pack) => void;
}) {
  const discountedPrice = Math.round(pack.price * (1 - DISCOUNT_RATE));

  return (
    <div
      onClick={() => onSelect(pack)}
      className="relative rounded-2xl text-center cursor-pointer overflow-hidden
        bg-white active:scale-95 transition-transform select-none"
      style={{
        border: pack.best_value ? `2px solid ${ACCENT}` : "1px solid #E4E4E7",
        padding: pack.best_value ? "0 10px 12px" : "12px 10px 10px",
        boxShadow: pack.best_value
          ? "0 4px 18px rgba(124,58,237,0.15)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Best value banner */}
      {pack.best_value && (
        <div
          className="text-[9px] font-black uppercase tracking-widest py-[5px] mb-3 -mx-0"
          style={{ background: ACCENT, color: "#fff" }}
        >
          ★ Best Value
        </div>
      )}

      {/* Bonus badge */}
      {pack.bonus && (
        <span
          className="absolute top-2 right-2 text-[9px] font-bold rounded-full px-1.5 py-0.5"
          style={{
            background: "rgba(124,58,237,0.08)",
            color: ACCENT,
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          {pack.bonus}
        </span>
      )}

      {/* Coin icon */}
      <div className="flex justify-center items-center h-14 mb-2">
        <div
          className="rounded-full p-2 flex items-center justify-center"
          style={{
            background: pack.best_value
              ? "rgba(124,58,237,0.08)"
              : "rgba(0,0,0,0.03)",
            border: pack.best_value
              ? "1.5px solid rgba(124,58,237,0.2)"
              : "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <CoinIcon size={36} />
        </div>
      </div>

      {/* Coin count */}
      <p className="text-sm font-bold text-zinc-900 leading-tight">
        {pack.coins.toLocaleString()}
        <span className="text-[10px] font-medium text-zinc-400 ml-1">coins</span>
      </p>

      {/* Price */}
      <div className="mt-2">
        {discounted ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{
              fontSize: 10, fontWeight: 500, color: "#A1A1AA",
              textDecoration: "line-through", lineHeight: 1.2,
            }}>
              {currency}{pack.price.toLocaleString()}
            </span>
            <div style={{
              background: "rgba(124,58,237,0.08)",
              borderRadius: 99,
              padding: "3px 8px",
              display: "inline-block",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>
                {currency}{discountedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-100 rounded-full py-1.5 px-2">
            <span className="text-xs font-semibold text-zinc-500">
              {currency}{pack.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Octacoin() {
  const [open, setOpen]               = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [discounted, setDiscounted]   = useState(false);
  const currentBalance                = 1250;

  const handleSelect = (pack: Pack) => {
    setSelectedPack(pack);
    setOpen(true);
  };

  const effectivePack = selectedPack && discounted
    ? { ...selectedPack, price: Math.round(selectedPack.price * (1 - DISCOUNT_RATE)) }
    : selectedPack;

  return (
    <div>
      <PageMeta
        title="Buy Octacoin | OctaGames"
        description="Purchase OctaCoins to use across OctaGames platform"
      />

      <div className="p-4 xl:px-10 xl:py-12">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            bg-zinc-100 border border-zinc-200 active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-zinc-500">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="text-[18px] font-extrabold text-zinc-900">Buy Octacoin</h1>
            <p className="text-[12px] text-zinc-400 mt-0.5">No coin, no glory</p>
          </div>

          {/* Balance pill */}
          <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200
            rounded-full px-3 py-1.5 flex-shrink-0">
            <CoinIcon size={22} />
            <span className="text-sm font-bold text-zinc-900">
              {currentBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Coupon ────────────────────────────────────────────────────── */}
        <CouponSection onApply={setDiscounted} />

        {/* ── Pack grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2.5">
          {ALL_PACKS.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              discounted={discounted}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* ── Payment bottom sheet ──────────────────────────────────────── */}
        <BottomSheet
          title="Select a payment option"
          subtitle="Choose an option to proceed"
          isOpen={open}
          onClose={() => setOpen(false)}
        >
          <PaymentOptions pack={effectivePack} />
        </BottomSheet>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Copy, Check, Eye, EyeOff, Landmark, Plus } from "lucide-react";

interface BankCard {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  logoUrl?: string;
}

const BANK_COLORS: Record<string, { bg: string; text: string }> = {
  "Access Bank":    { bg: "#E8192C", text: "#fff" },
  "GTBank":         { bg: "#F06700", text: "#fff" },
  "Zenith Bank":    { bg: "#C8102E", text: "#fff" },
  "First Bank":     { bg: "#003087", text: "#fff" },
  "UBA":            { bg: "#E31837", text: "#fff" },
  "Kuda":           { bg: "#400072", text: "#fff" },
  "Opay":           { bg: "#1AAD19", text: "#fff" },
  "Moniepoint":     { bg: "#0A2E65", text: "#fff" },
  default:          { bg: "#7C3AED", text: "#fff" },
};

function getBankInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function getBankColor(bankName: string) {
  return BANK_COLORS[bankName] ?? BANK_COLORS.default;
}

function maskAccount(num: string) {
  return "••••••" + num.slice(-3);
}

// ─── Single Card ─────────────────────────────────────────────────────────────
function BankCardItem({ card }: { card: BankCard }) {
  const color = getBankColor(card.bankName);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(card.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div
      className="flex-shrink-0 w-[fit-content] scroll-snap-center"
      style={{ scrollSnapAlign: "center" }}
    >
      <div
        className="relative w-[260px] overflow-hidden"
        style={{
          background: "#0a0a0a",
          borderRadius: 10,
          padding: "16px 18px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top: bank identity */}
        <div className="flex items-center gap-2.5" style={{ marginBottom: 18 }}>
          {card.logoUrl ? (
            <img
              src={card.logoUrl}
              alt={card.bankName}
              style={{
                width: 34, height: 34, borderRadius: 10,
                objectFit: "contain", background: "#fff", padding: 4,
              }}
            />
          ) : (
            <div
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: color.bg, color: color.text,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, letterSpacing: 0.5,
                flexShrink: 0,
              }}
            >
              {getBankInitials(card.bankName)}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13, fontWeight: 700, color: "#fff",
                margin: 0, lineHeight: 1.3,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {card.bankName}
            </p>
            <p
              style={{
                fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.4)",
                margin: 0, letterSpacing: "0.08em", textTransform: "uppercase",
              }}
            >
              Bank Account
            </p>
          </div>

          <Landmark
            size={16}
            color="rgba(255,255,255,0.2)"
            style={{ marginLeft: "auto", flexShrink: 0 }}
          />
        </div>

        {/* Account number block */}
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)",
              margin: 0, marginBottom: 6, letterSpacing: "0.14em", textTransform: "uppercase",
            }}
          >
            Account Number
          </p>
          <div className="flex items-center justify-between">
            <p
              style={{
                fontSize: 19, fontWeight: 800, color: "#fff",
                margin: 0, letterSpacing: "0.08em",
              }}
            >
              {revealed ? card.accountNumber : maskAccount(card.accountNumber)}
            </p>
            <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
              <button
                onClick={() => setRevealed((r) => !r)}
                aria-label={revealed ? "Hide account number" : "Show account number"}
                style={iconBtnStyle}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={handleCopy}
                aria-label="Copy account number"
                style={iconBtnStyle}
              >
                {copied ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />

        {/* Account name */}
        <div>
          <p
            style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)",
              margin: 0, marginBottom: 4, letterSpacing: "0.14em", textTransform: "uppercase",
            }}
          >
            Account Name
          </p>
          <p
            style={{
              fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)",
              margin: 0, textTransform: "uppercase", letterSpacing: "0.03em",
            }}
          >
            {card.accountName}
          </p>
        </div>

        {/* Bank-colored accent strip */}
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 3, background: color.bg,
          }}
        />
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 8,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "rgba(255,255,255,0.7)", cursor: "pointer",
  transition: "background 0.15s ease, color 0.15s ease",
};

// ─── Dots ────────────────────────────────────────────────────────────────────
function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 18 : 7,
            height: 7,
            borderRadius: 99,
            background: i === active ? "#7C3AED" : "rgba(255,255,255,0.15)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Bank Cards List ──────────────────────────────────────────────────────────
interface BankCardsProps {
  cards: BankCard[];
  onAddBank: () => void;
}

export function BankCards({ cards, onAddBank }: BankCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const limited = cards.slice(0, 3);
  const canAdd  = limited.length < 3;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el    = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  };

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Your Banks</h2>
      </div>

      {limited.length === 0 ? (
        /* Empty state */
        <div
          style={{
            border: "1.5px dashed rgba(255,255,255,0.15)",
            borderRadius: 16, padding: "36px 20px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Landmark size={20} color="rgba(255,255,255,0.4)" />
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 600 }}>
            No bank accounts added
          </p>
        </div>
      ) : (
        <>
          {/* Scrollable row */}
          <div
            onScroll={handleScroll}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              gap: 10,
              paddingBottom: 2,
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              width: "100%",
            }}
          >
            {limited.map((card) => (
              <BankCardItem key={card.id} card={card} />
            ))}
          </div>

          {/* Dots */}
          {limited.length > 1 && <Dots total={limited.length} active={activeIndex} />}
        </>
      )}

      {/* CTA */}
      {canAdd && (
        <button
          onClick={onAddBank}
          style={{
            width: "100%", marginTop: 18,
            padding: "12px 0",
            borderRadius: 12,
            color: "#7C3AED",
            fontSize: 14, fontWeight: 700,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124, 58, 237, 0.14)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124, 58, 237, 0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124, 58, 237, 0.08)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124, 58, 237, 0.35)";
          }}
        >
          <Plus size={16} />
          Add Bank Account
        </button>
      )}

      {!canAdd && (
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12, letterSpacing: "0.05em" }}>
          Maximum of 3 bank accounts reached
        </p>
      )}
    </div>
  );
}
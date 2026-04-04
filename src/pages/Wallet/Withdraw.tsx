import { useState, useRef, useEffect } from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Bank {
  id: string;
  name: string;
  shortCode: string;
}

interface WithdrawData {
  bank: Bank | null;
  accountNumber: string;
  accountName: string;
  amount: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const banks: Bank[] = [
  { id: "gtb", name: "GTBank", shortCode: "GTB" },
  { id: "access", name: "Access Bank", shortCode: "ACC" },
  { id: "uba", name: "UBA", shortCode: "UBA" },
  { id: "firstbank", name: "First Bank", shortCode: "FBN" },
  { id: "zenith", name: "Zenith Bank", shortCode: "ZEN" },
  { id: "stanbic", name: "Stanbic IBTC", shortCode: "STB" },
  { id: "fcmb", name: "FCMB", shortCode: "FCM" },
  { id: "sterling", name: "Sterling Bank", shortCode: "STR" },
  { id: "fidelity", name: "Fidelity Bank", shortCode: "FID" },
  { id: "wema", name: "Wema Bank", shortCode: "WEM" },
];

const FEE = 10;

// ─── Sub-components ──────────────────────────────────────────────────────────

const BankAvatar = ({ bank, size = 40 }: { bank: Bank; size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 12,
      background: "var(--bank-avatar-bg, #F0EFFF)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* IMAGE PLACEHOLDER — replace <img> here when bank logos are available */}
    {/* <img src={`/assets/banks/${bank.id}.png`} alt={bank.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
    <span style={{ fontSize: 10, fontWeight: 600, color: "#000", letterSpacing: "0.02em" }}>
      {bank.shortCode}
    </span>
    <div style={{
      position: "absolute", inset: 0,  borderRadius: 11, pointerEvents: "none"
    }} />
  </div>
);

const BankSelectSheet = ({
  onSelect,
}: {
  onSelect: (bank: Bank) => void;
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const filtered = banks.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Search */}
      <div style={{
        position: "relative",
        marginBottom: 8,
      }}>
        <svg
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search banks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px 12px 40px",
            borderRadius: 14,
            background: "rgba(123,116,232,0.06)",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 340, overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, padding: "24px 0" }}>
            No banks found
          </p>
        ) : (
          filtered.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onSelect(bank)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 10px",
                borderRadius: 14,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(123,116,232,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <BankAvatar bank={bank} size={44} />
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500}}>
                  {bank.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", marginTop: 1 }}>
                  {bank.shortCode}
                </p>
              </div>
              <svg
                style={{ marginLeft: "auto", opacity: 0.25 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const WithdrawPreviewSheet = ({
  data,
  onClose,
  onConfirm,
}: {
  data: WithdrawData;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const fee = FEE;
  const total = Number(data.amount) - fee;

  const rows = [
    { label: "Bank", value: data.bank?.name },
    { label: "Account name", value: data.accountName },
    { label: "Account number", value: data.accountNumber },
    { label: "Transaction fee", value: `₦${fee.toLocaleString()}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Amount hero */}
      <div style={{
        background: "linear-gradient(135deg, #6C63FF 0%, #8B85F0 100%)",
        borderRadius: 20,
        padding: "24px 20px",
        textAlign: "center",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{
          position: "absolute", width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)", top: -30, right: -20,
        }} />
        <div style={{
          position: "absolute", width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", bottom: -20, left: 10,
        }} />
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          You're sending
        </p>
        <p style={{ margin: "0 0 2px", fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
          ₦{Number(data.amount).toLocaleString()}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Recipient gets ₦{total.toLocaleString()}
        </p>
      </div>

      {/* Details card */}
      <div style={{
        border: "1.5px solid rgba(0,0,0,0.07)",
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 20,
      }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(123,116,232,0.025)",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}

        {/* Total row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          background: "rgba(108,99,255,0.06)",
          borderTop: "1.5px solid rgba(108,99,255,0.12)",
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#6C63FF" }}>Recipient receives</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#6C63FF" }}>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Security note */}
      <div style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "12px 14px",
        background: "rgba(34,197,94,0.06)",
        border: "1px solid rgba(34,197,94,0.15)",
        borderRadius: 12,
        marginBottom: 20,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p style={{ margin: 0, fontSize: 12, color: "#16a34a", lineHeight: 1.5 }}>
          This transaction is secured and encrypted. Funds are transferred instantly.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: 16,
            border: "1.5px solid rgba(0,0,0,0.1)",
            background: "transparent",
            fontSize: 15,
            fontWeight: 500,
            color: "var(--muted)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Edit
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 2,
            padding: "15px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #6C63FF 0%, #8B85F0 100%)",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
          }}
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WithdrawPage() {
  const [bank, setBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [amount, setAmount] = useState("");

  const [openBankSheet, setOpenBankSheet] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleAccountLookup = (value: string) => {
    const cleaned = value.slice(0, 10);
    setAccountNumber(cleaned);
    setAccountName("");

    if (cleaned.length === 10) {
      setLookingUp(true);
      // Simulate async API lookup
      setTimeout(() => {
        setAccountName("John Doe");
        setLookingUp(false);
      }, 800);
    }
  };

  const parsedAmount = Number(amount);
  const canProceed =
    bank &&
    accountNumber.length === 10 &&
    accountName &&
    parsedAmount > FEE;

  const handleConfirm = () => {
    // TODO: wire up real transfer API
    setOpenPreview(false);
  };

  return (
    <>
      {/* Global styles injected once */}
      <style>{`
        :root {
          --accent: #09f2a6;
          --accent-light: #09f2a6;
          --fg: #111;
          --muted: #888;
          --surface: #F9F9FB;
          --border: rgba(0,0,0,0.08);
          --bank-avatar-bg: #F0EFFF;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --fg: #F0F0F0;
            --muted: #777;
            --surface: #1C1C1E;
            --border: rgba(255,255,255,0.08);
            --bank-avatar-bg: #2A2840;
          }
        }
        .input-field {
          width: 100%;
          box-sizing: border-box;
          padding: 0 16px;
          height: 56px;
          border-radius: 10px;
          background: var(--surface);
          font-size: 15px;
          color: var(--fg);
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(108,99,255,0.12);
        }
        .input-field::placeholder { color: var(--muted); }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div className="flex items-center gap-3 pt-3 pb-0 mb-6">
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
              bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
              active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-gray-500 dark:text-white/50">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Withdraw</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Transfer funds to your bank account</p>
          </div>
        </div>

        {/* Bank selector */}
        <div className="mb-3">
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Bank
          </label>
          <button
            onClick={() => setOpenBankSheet(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px 10px 10px",
              borderRadius: 16,
              background: bank ? "rgba(108,99,255,0.04)" : "var(--surface)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {bank ? (
              <>
                <BankAvatar bank={bank} size={40} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "" }}>{bank.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>{bank.shortCode}</p>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <span style={{ fontSize: 15, color: "var(--muted)", flex: 1 }}>Select your bank</span>
              </>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Account Number */}
        <div className="mb-3">
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Account Number
          </label>
          <input
            className="input-field"
            type="number"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => handleAccountLookup(e.target.value)}
            maxLength={10}
          />
        </div>

        {/* Account Name */}
        <div className="mb-3" style={{
          padding: "14px 16px",
          borderRadius: 16,
          border: `1.5px solid ${accountName ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
          background: accountName ? "rgba(34,197,94,0.04)" : "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56,
          transition: "all 0.2s",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Account Name</p>
            <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: accountName ? 500 : 400,}}>
              {lookingUp ? "Looking up account..." : accountName || "Will appear after account number"}
            </p>
          </div>
          {accountName && (
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: "rgba(34,197,94,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Amount
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, fontWeight: 600, color: amount ? "var(--accent)" : "var(--muted)",
            }}>₦</span>
            <input
              className="input-field"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ paddingLeft: 32, fontSize: 18, fontWeight: 500 }}
            />
          </div>
          {parsedAmount > 0 && parsedAmount <= FEE && (
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ef4444" }}>
              Amount must be greater than the ₦{FEE} fee.
            </p>
          )}
          {parsedAmount > FEE && (
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>
              Recipient gets <strong>₦{(parsedAmount - FEE).toLocaleString()}</strong> after ₦{FEE} fee
            </p>
          )}
        </div>

        {/* Proceed */}
        <button
          disabled={!canProceed}
          onClick={() => setOpenPreview(true)}
          style={{
            marginTop: 8,
            padding: "17px",
            borderRadius: 18,
            border: "none",
            background: canProceed
              ? "linear-gradient(135deg, #6C63FF 0%, #8B85F0 100%)"
              : "rgba(0,0,0,0.06)",
            color: canProceed ? "#fff" : "var(--muted)",
            fontSize: 16,
            fontWeight: 600,
            cursor: canProceed ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            transition: "all 0.2s",
            transform: canProceed ? "scale(1)" : "scale(0.98)",
          }}
        >
          Continue →
        </button>
      </div>

      {/* Bank Sheet */}
      <BottomSheet title="Select Bank" isOpen={openBankSheet} onClose={() => setOpenBankSheet(false)}>
        <BankSelectSheet
          onSelect={(selectedBank) => {
            setBank(selectedBank);
            setOpenBankSheet(false);
          }}
        />
      </BottomSheet>

      {/* Preview Sheet */}
      <BottomSheet title="Review Transfer" isOpen={openPreview} onClose={() => setOpenPreview(false)}>
        <WithdrawPreviewSheet
          data={{ bank, accountName, accountNumber, amount }}
          onClose={() => setOpenPreview(false)}
          onConfirm={handleConfirm}
        />
      </BottomSheet>
    </>
  );
}
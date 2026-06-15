import { useState } from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bank {
  id: string;
  name: string;
  shortCode: string;
  brandColor?: string;
}

interface WithdrawData {
  bank: Bank | null;
  accountNumber: string;
  accountName: string;
  amount: string;
}

const banks: Bank[] = [
  { id: "gtb",       name: "GTBank",        shortCode: "GTB", brandColor: "#FF6200" },
  { id: "access",    name: "Access Bank",   shortCode: "ACC", brandColor: "#E8192C" },
  { id: "uba",       name: "UBA",           shortCode: "UBA", brandColor: "#CC0000" },
  { id: "firstbank", name: "First Bank",    shortCode: "FBN", brandColor: "#003087" },
  { id: "zenith",    name: "Zenith Bank",   shortCode: "ZEN", brandColor: "#C8102E" },
  { id: "stanbic",   name: "Stanbic IBTC",  shortCode: "STB", brandColor: "#0033A0" },
  { id: "fcmb",      name: "FCMB",          shortCode: "FCM", brandColor: "#F15A2B" },
  { id: "sterling",  name: "Sterling Bank", shortCode: "STR", brandColor: "#007A3D" },
  { id: "fidelity",  name: "Fidelity Bank", shortCode: "FID", brandColor: "#009A44" },
  { id: "wema",      name: "Wema Bank",     shortCode: "WEM", brandColor: "#8B008B" },
];

const FEE     = 10;
const BALANCE = 12700;
const ACCENT  = "#7C3AED";

// ─── Shared field classes (light-bg safe) ─────────────────────────────────────
const fieldCls =
  "w-full h-[54px] px-4 rounded-2xl border border-zinc-200 " +
  "bg-zinc-50 text-[15px] text-zinc-900 outline-none " +
  "placeholder:text-zinc-300 transition-colors " +
  "focus:border-zinc-400 focus:bg-white";

// ─── Bank avatar ──────────────────────────────────────────────────────────────
const BankAvatar = ({ bank, size = 40 }: { bank: Bank; size?: number }) => (
  <div
    style={{
      width: size, height: size, borderRadius: 12, flexShrink: 0,
      background: `${bank.brandColor ?? "#888"}18`,
      border: `0.5px solid ${bank.brandColor ?? "#888"}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    <span style={{ fontSize: 11, fontWeight: 800, color: bank.brandColor ?? "#888" }}>
      {bank.shortCode}
    </span>
  </div>
);

// ─── Bank select sheet ────────────────────────────────────────────────────────
const BankSelectSheet = ({ onSelect }: { onSelect: (b: Bank) => void }) => {
  const [query, setQuery] = useState("");
  const filtered = banks.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-0">
      <div className="relative mb-2.5">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search banks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] outline-none
            bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-300
            focus:border-zinc-400 focus:bg-white transition-colors"
        />
      </div>
      <div className="flex flex-col max-h-[320px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 text-[14px] py-6">No banks found</p>
        ) : (
          filtered.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onSelect(bank)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-2xl border-none
                bg-transparent cursor-pointer text-left w-full
                hover:bg-zinc-50 active:scale-[0.98] transition-all"
            >
              <BankAvatar bank={bank} size={44} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-zinc-900 m-0">{bank.name}</p>
                <p className="text-[11px] text-zinc-400 m-0 mt-0.5">{bank.shortCode}</p>
              </div>
              <svg className="text-zinc-300" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Confirm / preview sheet ──────────────────────────────────────────────────
const WithdrawPreviewSheet = ({
  data, onClose, onConfirm,
}: {
  data: WithdrawData;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const amount = Number(data.amount);
  const total  = amount - FEE;

  const rows = [
    { label: "Bank",           value: data.bank?.name },
    { label: "Account name",   value: data.accountName },
    { label: "Account number", value: data.accountNumber },
    { label: "Fee",            value: `₦${FEE.toLocaleString()}` },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Amount hero */}
      <div
        className="relative rounded-[20px] px-5 py-6 text-center mb-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/[0.06] pointer-events-none" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-widest mb-1.5 text-white/60">
            You're sending
          </p>
          <p className="text-[38px] font-extrabold text-white leading-tight">
            ₦{amount.toLocaleString()}
          </p>
          <p className="text-[13px] mt-1 text-white/60">
            Recipient gets{" "}
            <span className="font-bold text-white">₦{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="rounded-[18px] overflow-hidden border border-zinc-100 mb-4">
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-3.5 border-b border-zinc-100"
            style={{ background: i % 2 === 1 ? "#fafafa" : "#fff" }}
          >
            <span className="text-[13px] text-zinc-400">{label}</span>
            <span className="text-[14px] font-semibold text-zinc-900">{value}</span>
          </div>
        ))}
        {/* Total row */}
        <div className="flex justify-between items-center px-4 py-4 bg-white">
          <span className="text-[14px] font-bold" style={{ color: ACCENT }}>Recipient receives</span>
          <span className="text-[16px] font-extrabold" style={{ color: ACCENT }}>
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div
        className="flex items-center gap-2 px-3.5 py-3 rounded-xl mb-5 border"
        style={{ background: "#faf8ff", borderColor: "rgba(124,58,237,0.12)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-[12px] m-0 font-medium" style={{ color: ACCENT }}>
          Secured & encrypted. Funds are transferred instantly.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border border-zinc-200
            bg-transparent text-[14px] font-semibold text-zinc-500
            cursor-pointer hover:bg-zinc-50 active:scale-[0.97] transition-all"
        >
          Edit
        </button>
        <button
          onClick={onConfirm}
          className="flex-[2] text-white py-3.5 rounded-2xl border-none text-[14px] font-extrabold
            flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
          style={{
            background: ACCENT,
            boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
          }}
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
};

// ─── Success sheet (replaces old fullscreen overlay) ─────────────────────────
const SuccessSheet = ({
  data,
  onDone,
}: {
  data: WithdrawData;
  onDone: () => void;
}) => {
  const amount = Number(data.amount);
  const total  = amount - FEE;
  // Simple random reference
  const ref = `TXN-${Date.now().toString().slice(-8).toUpperCase()}`;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon ring */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(124,58,237,0.06))",
          border: "2px solid rgba(124,58,237,0.18)",
        }}
      >
        {/* Outer pulse ring */}
        <div
          className="absolute inset-[-6px] rounded-full border"
          style={{ borderColor: "rgba(124,58,237,0.10)" }}
        />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <polyline
            points="6 12 10 16 18 8"
            stroke={ACCENT}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-[20px] font-black text-zinc-900 mb-1">Transfer Successful</h2>
      <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[240px] mb-5">
        Your funds have been sent and will arrive shortly.
      </p>

      {/* Amount chip */}
      <div
        className="relative w-full rounded-2xl px-5 py-4 mb-4 overflow-hidden flex flex-col items-center gap-1"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, #6D28D9)` }}
      >
        <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-6 -left-3 w-16 h-16 rounded-full bg-white/[0.06] pointer-events-none" />
        <span className="relative text-[10px] font-bold tracking-widest uppercase text-white/60">
          Amount Sent
        </span>
        <span className="relative text-[32px] font-black text-white leading-tight">
          ₦{amount.toLocaleString()}
        </span>
      </div>

      {/* Reference */}
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <span className="text-[11px] text-zinc-400">Reference</span>
        <span className="text-[11px] font-bold text-zinc-500 font-mono">{ref}</span>
      </div>

      {/* Receipt rows */}
      <div className="w-full rounded-[14px] border border-zinc-100 overflow-hidden mb-4">
        {[
          { label: "Bank",           value: data.bank?.name ?? "—" },
          { label: "Account name",   value: data.accountName },
          { label: "Account number", value: data.accountNumber },
          { label: "Fee",            value: `₦${FEE.toLocaleString()}` },
          { label: "Recipient gets", value: `₦${total.toLocaleString()}`, purple: true },
          { label: "Status",         value: "completed" as const },
        ].map(({ label, value, purple }, i) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-3 border-b border-zinc-100 last:border-b-0"
            style={{ background: i % 2 === 1 ? "#fafafa" : "#fff" }}
          >
            <span className="text-[12px] text-zinc-400">{label}</span>
            {label === "Status" ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border"
                style={{
                  background: "rgba(124,58,237,0.07)",
                  borderColor: "rgba(124,58,237,0.15)",
                  color: ACCENT,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                Completed
              </span>
            ) : (
              <span
                className="text-[13px] font-semibold"
                style={{ color: purple ? ACCENT : "#111" }}
              >
                {value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Secure note */}
      <div
        className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl mb-5 border"
        style={{ background: "#faf8ff", borderColor: "rgba(124,58,237,0.12)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-[12px] font-medium" style={{ color: ACCENT }}>
          Secured & encrypted. Funds transferred instantly.
        </span>
      </div>

      {/* Done CTA */}
      <button
        onClick={onDone}
        className="w-full flex items-center justify-center gap-2 py-[15px] rounded-2xl
          text-white text-[15px] font-extrabold border-none cursor-pointer
          active:scale-[0.97] transition-all"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}, #6D28D9)`,
          boxShadow: "0 4px 18px rgba(124,58,237,0.32)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Done
      </button>
    </div>
  );
};

// ─── Failed sheet ─────────────────────────────────────────────────────────────
const FailedSheet = ({
  onRetry,
  onDone,
}: {
  onRetry: () => void;
  onDone: () => void;
}) => (
  <div className="flex flex-col items-center text-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{ background: "rgba(220,38,38,0.08)", border: "2px solid rgba(220,38,38,0.15)" }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6"  y1="6" x2="18" y2="18" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>

    <h2 className="text-[20px] font-black text-zinc-900 mb-1">Transfer Failed</h2>
    <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[240px] mb-8">
      Something went wrong. Your funds were not debited. Please try again.
    </p>

    <div className="flex flex-col gap-2.5 w-full">
      <button
        onClick={onRetry}
        className="w-full py-4 rounded-2xl text-white text-[15px] font-extrabold
          active:scale-[0.97] transition-all border-none cursor-pointer"
        style={{ background: "#dc2626", boxShadow: "0 4px 14px rgba(220,38,38,0.25)" }}
      >
        Try Again
      </button>
      <button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl border border-zinc-200
          bg-transparent text-[14px] font-semibold text-zinc-500
          cursor-pointer hover:bg-zinc-50 active:scale-[0.97] transition-all"
      >
        Back to Wallet
      </button>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
type Sheet = "bank" | "preview" | "success" | "failed" | null;

export default function WithdrawPage() {
  const [bank, setBank]               = useState<Bank | null>(null);
  const [accountNumber, setAccNum]    = useState("");
  const [accountName, setAccName]     = useState("");
  const [lookingUp, setLookingUp]     = useState(false);
  const [amount, setAmount]           = useState("");
  const [activeSheet, setActiveSheet] = useState<Sheet>(null);

  const parsedAmount   = Number(amount);
  const exceedsBalance = parsedAmount > BALANCE;
  const canProceed     =
    bank && accountNumber.length === 10 && accountName &&
    parsedAmount > FEE && !exceedsBalance;

  const handleAccNum = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setAccNum(cleaned);
    setAccName("");
    if (cleaned.length === 10) {
      setLookingUp(true);
      setTimeout(() => { setAccName("John Doe"); setLookingUp(false); }, 800);
    }
  };

  const handleConfirm = () => {
    setActiveSheet(null);
    // Swap "success" / "failed" here with your real API response
    setTimeout(() => setActiveSheet("success"), 300);
  };

  const handleReset = () => {
    setBank(null);
    setAccNum("");
    setAccName("");
    setAmount("");
    setActiveSheet(null);
  };

  const withdrawData: WithdrawData = { bank, accountNumber, accountName, amount };

  return (
    <>
      {/* ── Scrollable form ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 px-4 pt-5 pb-32 max-w-[480px] mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            bg-zinc-100 border border-zinc-200 active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-zinc-500">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-extrabold text-zinc-900">Withdraw</h1>
            <p className="text-[12px] text-zinc-400 mt-0.5">Transfer funds to your bank account</p>
          </div>
          {/* Balance pill */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5
            bg-zinc-100 border border-zinc-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span className="text-[13px] font-bold text-zinc-900">
              ₦{BALANCE.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bank selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
            Bank
          </label>
          <button
            onClick={() => setActiveSheet("bank")}
            className="w-full flex items-center gap-3 py-2.5 pl-2.5 pr-4 rounded-2xl text-left
              transition-all active:scale-[0.98] border border-zinc-200 bg-zinc-50
              hover:bg-zinc-100 hover:border-zinc-300"
          >
            {bank ? (
              <>
                <BankAvatar bank={bank} size={40} />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-zinc-900 m-0">{bank.name}</p>
                  <p className="text-[11px] text-zinc-400 m-0">{bank.shortCode}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" className="text-zinc-400">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <span className="flex-1 text-[14px] text-zinc-400">Select your bank</span>
              </>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-zinc-400 flex-shrink-0">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
            Account Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => handleAccNum(e.target.value)}
            className={fieldCls}
          />
        </div>

        {/* Account Name */}
        <div
          className="flex items-center justify-between px-4 py-3.5 rounded-2xl min-h-[56px]
            border border-zinc-200 bg-zinc-50"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 m-0">
              Account Name
            </p>
            <p
              className="text-[14px] m-0 mt-1 transition-all"
              style={{
                color:      accountName ? "#111" : "#d1d5db",
                fontWeight: accountName ? 600 : 400,
              }}
            >
              {lookingUp
                ? "Looking up account…"
                : accountName || "Will appear after account number"}
            </p>
          </div>
          {accountName && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-50">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Amount
            </label>
            <button
              onClick={() => setAmount(String(BALANCE - FEE))}
              className="text-[11px] font-bold rounded-full px-2.5 py-1 border-none cursor-pointer
                bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              Max
            </button>
          </div>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold"
              style={{ color: parsedAmount > 0 ? "#111" : "#d1d5db" }}
            >
              ₦
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={fieldCls + " pl-8 text-[18px] font-semibold"}
            />
          </div>
          <div className="text-[12px] mt-1.5 min-h-[18px]">
            {parsedAmount > 0 && parsedAmount <= FEE && (
              <span className="text-red-500">Min amount must exceed the ₦{FEE} fee</span>
            )}
            {exceedsBalance && parsedAmount > FEE && (
              <span className="text-red-500">Exceeds your balance of ₦{BALANCE.toLocaleString()}</span>
            )}
            {parsedAmount > FEE && !exceedsBalance && (
              <span className="text-zinc-400">
                Recipient gets{" "}
                <strong className="text-zinc-700">₦{(parsedAmount - FEE).toLocaleString()}</strong>
                {" "}after ₦{FEE} fee
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #fff 80%, transparent)" }}
      >
        <div className="max-w-[480px] mx-auto">
          <button
            disabled={!canProceed}
            onClick={() => canProceed && setActiveSheet("preview")}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
              text-[15px] font-extrabold transition-all active:scale-[0.97] disabled:cursor-not-allowed"
            style={
              canProceed
                ? {
                    background: ACCENT,
                    color: "#fff",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  }
                : { background: "#f4f4f5", color: "#a1a1aa" }
            }
          >
            {canProceed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
            {canProceed ? "Continue" : "Fill in all fields to continue"}
          </button>
        </div>
      </div>

      {/* ── Bottom sheets ──────────────────────────────────────────────────── */}
      <BottomSheet
        title="Select Bank"
        isOpen={activeSheet === "bank"}
        onClose={() => setActiveSheet(null)}
      >
        <BankSelectSheet
          onSelect={(b) => { setBank(b); setActiveSheet(null); }}
        />
      </BottomSheet>

      <BottomSheet
        title="Review Transfer"
        isOpen={activeSheet === "preview"}
        onClose={() => setActiveSheet(null)}
      >
        <WithdrawPreviewSheet
          data={withdrawData}
          onClose={() => setActiveSheet(null)}
          onConfirm={handleConfirm}
        />
      </BottomSheet>

      {/* Success — no title, let the content speak */}
      <BottomSheet
        title=""
        isOpen={activeSheet === "success"}
        onClose={handleReset}
      >
        <SuccessSheet data={withdrawData} onDone={handleReset} />
      </BottomSheet>

      <BottomSheet
        title="Transfer Failed"
        isOpen={activeSheet === "failed"}
        onClose={() => setActiveSheet(null)}
      >
        <FailedSheet
          onRetry={() => setActiveSheet("preview")}
          onDone={handleReset}
        />
      </BottomSheet>
    </>
  );
}
import { useState, useRef, useEffect } from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

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
  { id: "gtb",       name: "GTBank",       shortCode: "GTB", brandColor: "#FF6200" },
  { id: "access",    name: "Access Bank",  shortCode: "ACC", brandColor: "#E8192C" },
  { id: "uba",       name: "UBA",          shortCode: "UBA", brandColor: "#CC0000" },
  { id: "firstbank", name: "First Bank",   shortCode: "FBN", brandColor: "#003087" },
  { id: "zenith",    name: "Zenith Bank",  shortCode: "ZEN", brandColor: "#C8102E" },
  { id: "stanbic",   name: "Stanbic IBTC", shortCode: "STB", brandColor: "#0033A0" },
  { id: "fcmb",      name: "FCMB",         shortCode: "FCM", brandColor: "#F15A2B" },
  { id: "sterling",  name: "Sterling Bank",shortCode: "STR", brandColor: "#007A3D" },
  { id: "fidelity",  name: "Fidelity Bank",shortCode: "FID", brandColor: "#009A44" },
  { id: "wema",      name: "Wema Bank",    shortCode: "WEM", brandColor: "#8B008B" },
];

const FEE     = 10;
const BALANCE = 12700; // pull from props/context in real app
const ACCENT      = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

// ─── Bank avatar ─────────────────────────────────────────────────────────────
const BankAvatar = ({ bank, size = 40 }: { bank: Bank; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: 12, flexShrink: 0,
    background: `${bank.brandColor ?? "#888"}18`,
    border: `0.5px solid ${bank.brandColor ?? "#888"}30`,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {/* Swap for <img> when logos are ready */}
    <span style={{ fontSize: 11, fontWeight: 800, color: bank.brandColor ?? "#888" }}>
      {bank.shortCode}
    </span>
  </div>
);

// ─── Bank select sheet ────────────────────────────────────────────────────────
const BankSelectSheet = ({ onSelect }: { onSelect: (b: Bank) => void }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  const filtered = banks.filter(b =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-0">
      {/* Search */}
      <div className="relative mb-2.5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input ref={inputRef} type="text" placeholder="Search banks..."
          value={query} onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] outline-none transition-all
            bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8
            text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20
            focus:border-[#09f2a6]" />
      </div>

      {/* List */}
      <div className="flex flex-col max-h-[320px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-[14px] py-6">No banks found</p>
        ) : filtered.map(bank => (
          <button key={bank.id} onClick={() => onSelect(bank)}
            className="flex items-center gap-3 px-2 py-2.5 rounded-2xl border-none
              bg-transparent cursor-pointer text-left w-full
              hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all">
            <BankAvatar bank={bank} size={44} />
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-gray-900 dark:text-white m-0">{bank.name}</p>
              <p className="text-[11px] text-gray-400 m-0 mt-0.5">{bank.shortCode}</p>
            </div>
            <svg className="opacity-25" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Preview sheet ────────────────────────────────────────────────────────────
const WithdrawPreviewSheet = ({
  data, onClose, onConfirm,
}: { data: WithdrawData; onClose: () => void; onConfirm: () => void }) => {
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

      {/* Amount hero — dark card matching your wallet card */}
      <div className="relative rounded-[20px] px-5 py-6 text-center mb-5 overflow-hidden"
        style={{ background: "#0a0a0a" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 120"
          preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="pg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#09f2a6" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#09f2a6" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="360" height="120" fill="url(#pg)"/>
          <circle cx="310" cy="20" r="70" fill="#09f2a6" opacity="0.04"/>
          <circle cx="40"  cy="100" r="50" fill="#09f2a6" opacity="0.04"/>
        </svg>
        <div className="relative">
          <p className="text-[11px] uppercase tracking-widest mb-1.5"
            style={{ color: "rgba(255,255,255,0.4)" }}>You're sending</p>
          <p className="text-[38px] font-extrabold text-white leading-tight">
            ₦{amount.toLocaleString()}
          </p>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Recipient gets{" "}
            <span className="font-bold" style={{ color: ACCENT }}>₦{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="rounded-[18px] overflow-hidden border border-gray-100 dark:border-white/8 mb-4">
        {rows.map(({ label, value }, i) => (
          <div key={label}
            className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 dark:border-white/8"
            style={{ background: i % 2 === 1 ? "var(--color-background-secondary)" : "var(--color-background-primary)" }}>
            <span className="text-[13px] text-gray-400">{label}</span>
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white">{value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-4"
          style={{ background: "rgba(9,242,166,0.06)", borderTop: `1px solid rgba(9,242,166,0.15)` }}>
          <span className="text-[14px] font-bold" style={{ color: ACCENT }}>Recipient receives</span>
          <span className="text-[16px] font-extrabold" style={{ color: ACCENT }}>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl mb-5"
        style={{ background: "rgba(9,242,166,0.06)", border: "1px solid rgba(9,242,166,0.15)" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
          className="flex-shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[12px] leading-relaxed m-0" style={{ color: ACCENT }}>
          Secured & encrypted. Funds are transferred instantly.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5">
        <button onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10
            bg-transparent text-[14px] font-semibold text-gray-500 dark:text-white/50
            cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.97] transition-all">
          Edit
        </button>
        <button onClick={onConfirm}
          className="flex-[2] py-3.5 rounded-2xl border-none text-[14px] font-extrabold
            flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
          style={{ background: ACCENT, color: ACCENT_TEXT }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Confirm Transfer
        </button>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function WithdrawPage() {
  const [bank, setBank]           = useState<Bank | null>(null);
  const [accountNumber, setAccNum]= useState("");
  const [accountName, setAccName] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [amount, setAmount]       = useState("");
  const [openBankSheet, setOpenBankSheet] = useState(false);
  const [openPreview, setOpenPreview]     = useState(false);

  const parsedAmount = Number(amount);
  const exceedsBalance = parsedAmount > BALANCE;
  const canProceed = bank && accountNumber.length === 10 && accountName &&
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
    setOpenPreview(false);
    // TODO: wire real API
  };

  // Shared field classes
  const fieldCls = "w-full h-[54px] px-4 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/8 " +
    "bg-gray-50 dark:bg-white/5 text-[15px] text-gray-900 dark:text-white outline-none " +
    "placeholder:text-gray-300 dark:placeholder:text-white/20 transition-all focus:border-[#09f2a6] " +
    "focus:shadow-[0_0_0_4px_rgba(9,242,166,0.08)]";

  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-24 max-w-[480px] mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
            active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-gray-500 dark:text-white/50">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-extrabold text-gray-900 dark:text-white">Withdraw</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Transfer funds to your bank account</p>
          </div>
          {/* Balance pill */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5
            bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/8">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
              <rect x="2" y="5" width="20" height="14" rx="3"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <span className="text-[13px] font-bold text-gray-900 dark:text-white">
              ₦{BALANCE.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bank selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bank</label>
          <button onClick={() => setOpenBankSheet(true)}
            className="w-full flex items-center gap-3 py-2.5 pl-2.5 pr-4 rounded-2xl text-left transition-all
              active:scale-[0.98] border-[1.5px]"
            style={{
              borderColor: bank ? "rgba(9,242,166,0.35)" : "var(--color-border-tertiary)",
              background:  bank ? "rgba(9,242,166,0.04)" : "var(--color-background-secondary)",
            }}>
            {bank ? (
              <>
                <BankAvatar bank={bank} size={40} />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white m-0">{bank.name}</p>
                  <p className="text-[11px] text-gray-400 m-0">{bank.shortCode}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="4"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <span className="flex-1 text-[14px] text-gray-400">Select your bank</span>
              </>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-gray-400 flex-shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Account Number
          </label>
          <input
            type="text" inputMode="numeric" maxLength={10}
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={e => handleAccNum(e.target.value)}
            className={fieldCls}
          />
        </div>

        {/* Account Name */}
        <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl min-h-[56px] transition-all border-[1.5px]"
          style={{
            borderColor: accountName ? "rgba(9,242,166,0.35)" : "var(--color-border-tertiary)",
            background:  accountName ? "rgba(9,242,166,0.04)" : "var(--color-background-secondary)",
          }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 m-0">Account Name</p>
            <p className="text-[14px] m-0 mt-1 transition-all"
              style={{ color: accountName ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                       fontWeight: accountName ? 600 : 400 }}>
              {lookingUp ? "Looking up account..." : accountName || "Will appear after account number"}
            </p>
          </div>
          {accountName && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(9,242,166,0.15)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Amount</label>
            <button onClick={() => setAmount(String(BALANCE - FEE))}
              className="text-[11px] font-bold rounded-full px-2.5 py-1 border-none cursor-pointer"
              style={{ background: "rgba(9,242,166,0.1)", color: ACCENT }}>
              Max
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold transition-colors"
              style={{ color: parsedAmount > 0 ? ACCENT : "var(--color-text-tertiary)" }}>₦</span>
            <input
              type="text" inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className={fieldCls + " pl-8 text-[18px] font-semibold"}
            />
          </div>
          <div className="text-[12px] mt-1.5 min-h-[18px]">
            {parsedAmount > 0 && parsedAmount <= FEE && (
              <span className="text-red-400">Min amount must exceed the ₦{FEE} fee</span>
            )}
            {exceedsBalance && parsedAmount > FEE && (
              <span className="text-red-400">Exceeds your balance of ₦{BALANCE.toLocaleString()}</span>
            )}
            {parsedAmount > FEE && !exceedsBalance && (
              <span className="text-gray-400">
                Recipient gets{" "}
                <strong className="text-gray-700 dark:text-white">
                  ₦{(parsedAmount - FEE).toLocaleString()}
                </strong>
                {" "}after ₦{FEE} fee
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button disabled={!canProceed} onClick={() => canProceed && setOpenPreview(true)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-extrabold
            transition-all active:scale-[0.97] disabled:cursor-not-allowed mt-1"
          style={canProceed
            ? { background: ACCENT, color: ACCENT_TEXT }
            : { background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)" }}>
          {canProceed && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          )}
          {canProceed ? "Continue" : "Fill in all fields to continue"}
        </button>
      </div>

      <BottomSheet title="Select Bank" isOpen={openBankSheet} onClose={() => setOpenBankSheet(false)}>
        <BankSelectSheet onSelect={b => { setBank(b); setOpenBankSheet(false); }} />
      </BottomSheet>

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
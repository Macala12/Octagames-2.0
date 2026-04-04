import { useState } from "react";
import { useNavigate } from "react-router";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import WalletQuickSettings from "../../components/ui/bottom-sheet/WalletSettingsSheet";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
}

const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

// --- Wallet Card ---
const WalletCard = ({
  balance = 0,
  onTopUp,
  onCashOut,
}: {
  balance: number;
  onTopUp?: () => void;
  onCashOut?: () => void;
}) => (
  <div className="relative rounded-3xl p-6 overflow-hidden mb-6" style={{ background: "#0a0a0a", minHeight: 190 }}>

    {/* Abstract SVG background */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 190"
      preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="360" height="190" fill="url(#dots)" />
      <ellipse cx="300" cy="30" rx="110" ry="90" fill="#09f2a6" opacity="0.08" />
      <ellipse cx="320" cy="50" rx="70" ry="55" fill="#09f2a6" opacity="0.1" />
      <ellipse cx="40" cy="170" rx="90" ry="70" fill="#7C3AED" opacity="0.12" />
      <ellipse cx="60" cy="160" rx="50" ry="40" fill="#7C3AED" opacity="0.1" />
      <circle cx="310" cy="190" r="120" fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.15" />
      <circle cx="310" cy="190" r="90"  fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.12" />
      <circle cx="310" cy="190" r="60"  fill="none" stroke="#09f2a6" strokeWidth="0.6" opacity="0.1" />
      <line x1="0" y1="130" x2="180" y2="0" stroke="rgba(9,242,166,0.06)" strokeWidth="40" />
      <rect x="24" y="95" width="36" height="28" rx="5" fill="none"
        stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="24" y1="109" x2="60" y2="109" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="42" y1="95"  x2="42" y2="123" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>

    {/* Content */}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Withdrawable Balance
        </p>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ background: "rgba(9,242,166,0.12)", border: "0.5px solid rgba(9,242,166,0.25)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[10px] font-bold" style={{ color: ACCENT }}>Active</span>
        </div>
      </div>

      <p className="text-[36px] font-extrabold text-white tracking-tight mb-7 leading-none">
        ₦{balance.toLocaleString()}
        <span className="text-[20px] text-white/40">.00</span>
      </p>

      <div className="flex gap-2.5">
        <button onClick={onTopUp}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[13px] font-bold active:scale-95 transition-transform"
          style={{ background: ACCENT, color: ACCENT_TEXT }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT_TEXT}
            strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Top Up
        </button>
        <button onClick={onCashOut}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[13px] font-bold text-white active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
          Cash Out
        </button>
      </div>
    </div>
  </div>
);

// --- Quick Stats ---
const QuickStats = ({ transactions }: { transactions: Transaction[] }) => {
  const totalWon   = transactions.filter(t => t.type === "credit" && t.status === "success").reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === "debit"  && t.status === "success").reduce((s, t) => s + t.amount, 0);
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-6">
      {[
        { label: "Total Won",   value: `₦${totalWon.toLocaleString()}`,   color: "var(--color-text-primary)" },
        { label: "Total Spent", value: `₦${totalSpent.toLocaleString()}`, color: "var(--color-text-primary)" },
      ].map(s => (
        <div key={s.label} className="rounded-2xl p-3.5 border border-gray-100 dark:border-white/8 bg-white dark:bg-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{s.label}</p>
          <p className="text-[18px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
};

// --- Status Badge ---
const statusConfig = {
  success: { bg: "rgba(9,242,166,0.1)",  color: "#09f2a6", label: "Success" },
  pending: { bg: "rgba(251,191,36,0.1)", color: "#FBBF24", label: "Pending" },
  failed:  { bg: "rgba(239,68,68,0.1)",  color: "#EF4444", label: "Failed"  },
};

// --- Transaction Item ---
const TransactionItem = ({ tx }: { tx: Transaction }) => {
  const isCredit = tx.type === "credit";
  const s = statusConfig[tx.status];
  return (
    <div className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-2xl px-3.5 py-3 mb-2 active:scale-[0.98] transition-transform cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ background: isCredit ? "rgba(9,242,166,0.1)" : "rgba(239,68,68,0.1)" }}>
          {isCredit ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09f2a6" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900 dark:text-white mb-0.5 max-w-[170px] truncate">{tx.title}</p>
          <p className="text-[11px] text-gray-400">{tx.date}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] font-bold mb-1.5"
          style={{ color: isCredit ? ACCENT : "var(--color-text-primary)" }}>
          {isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
        </p>
        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 inline-block"
          style={{ background: s.bg, color: s.color }}>{s.label}</span>
      </div>
    </div>
  );
};

// --- Group transactions by date label ---
function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach(tx => {
    const d = new Date(tx.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let label = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    if (d.toDateString() === today.toDateString())     label = "Today";
    if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });
  return groups;
}

// --- Empty State ---
const EmptyTransactions = ({ onTopUp }: { onTopUp?: () => void }) => (
  <div className="text-center py-12">
    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
      style={{ background: "rgba(9,242,166,0.1)" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#09f2a6" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="3" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    </div>
    <p className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">No transactions yet</p>
    <p className="text-[13px] text-gray-400 mb-5">Top up to get started</p>
    <button onClick={onTopUp} className="rounded-full px-5 py-2.5 text-[13px] font-bold active:scale-95 transition-transform"
      style={{ background: ACCENT, color: ACCENT_TEXT }}>
      Top Up Octacoins
    </button>
  </div>
);

// --- Main Screen ---
export default function WalletScreen({
  balance = 12700,
  transactions = [],
}: {
  balance: number;
  transactions: Transaction[];
}) {
  const navigate = useNavigate();
  const grouped = groupByDate(transactions);
  const [open, setOpen] = useState(false);
  return (
    <div className="p-2 pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">My Wallet</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage balance & transactions</p>
        </div>
        <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      <WalletCard balance={balance} onTopUp={() => {navigate('/octacoin')}} onCashOut={() => {navigate('/withdraw')}} />
      <QuickStats transactions={transactions} />

      {/* Transaction History */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Transaction History</h2>
        <button className="text-sm font-semibold p-2 rounded-[15px]" onClick={() => {navigate('/transaction')}}>See all </button>
      </div>

      {transactions.length === 0 ? (
        <EmptyTransactions onTopUp={() => {}} />
      ) : (
        Object.entries(grouped).map(([label, txs]) => (
          <div key={label} className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">{label}</p>
            {txs.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
          </div>
        ))
      )}

      <BottomSheet title="Withdrawal Settings" isOpen={open} onClose={() => setOpen(false)}>
        <WalletQuickSettings />
      </BottomSheet>
    </div>
  );
}
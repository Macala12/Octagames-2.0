import { useState } from "react";

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

export default function TransactionScreen({
  balance = 12700,
  transactions = [{
    id: "sadsa",
    type: "credit",
    title: "Octacoin Purchase",
    amount: 100,
    date: "12-01-20",
    status: "success"
  },
  {
    id: "sadsa",
    type: "credit",
    title: "Octacoin Purchase",
    amount: 100,
    date: "12-01-20",
    status: "success"
  }
],
}: {
  balance: number;
  transactions: Transaction[];
}) {

  const grouped = groupByDate(transactions);

  return (
    <div className="p-6 pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center mb-5">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h2 className="text-[16px] ml-3 font-bold text-gray-900 dark:text-white">Transaction History</h2>
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
    </div>
  );
}
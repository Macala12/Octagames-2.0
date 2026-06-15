import { useState } from "react";
import { useNavigate } from "react-router";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import WalletQuickSettings from "../../components/ui/bottom-sheet/WalletSettingsSheet";
import { BankCards } from "../../components/cards/BankCard";
import { AddBankForm } from "../../components/ui/bottom-sheet/BankForm";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
}

const ACCENT = "#7C3AED";
const ACCENT_TEXT = "#022b1e";
const DEMO_CARDS = [
  {
    id: "1",
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "ADEWALE JOHN SEUN",
  },
  {
    id: "2",
    bankName: "Moniepoint",
    accountNumber: "09012313234",
    accountName: "ADEWALE JOHN SEUN",
  },
];

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
  <div className="relative p-2 overflow-hidden mb-3 px-6" style={{ minHeight: 190 }}>

    {/* Content */}
    <div className="relative z-10 mt-4">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">
          Total Balance
        </p>
      </div>

      <p className="text-[32px] font-extrabold text-black tracking-tight leading-none">
        ₦{balance.toLocaleString()}
        <span className="text-[20px] text-black/40">.00</span>
      </p>
      <p className="mb-4 mt-2 text-[11px] text-black/70">updated just now</p>

      <div className="flex gap-2.5">
        <button onClick={onTopUp}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[20px] text-[13px] font-bold active:scale-95 transition-transform"
          style={{ background: "#7C3AED", color: "#0a0a0a" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={"#000"}
            strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Top Up
        </button>
        <button onClick={onCashOut}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[20px] text-[13px] font-bold text-white active:scale-95 transition-transform"
          style={{ border: "1px solid #000", color: "#000" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000"
            strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
          Withdraw
        </button>
      </div>
    </div>
  </div>
);

// --- Quick Stats ---
// const QuickStats = ({ transactions }: { transactions: Transaction[] }) => {
//   const totalWon   = transactions.filter(t => t.type === "credit" && t.status === "success").reduce((s, t) => s + t.amount, 0);
//   const totalSpent = transactions.filter(t => t.type === "debit"  && t.status === "success").reduce((s, t) => s + t.amount, 0);
//   return (
//     <div className="grid grid-cols-2 gap-2.5 mb-6">
//       {[
//         { label: "Total Won",   value: `₦${totalWon.toLocaleString()}`,   color: "var(--color-text-primary)" },
//         { label: "Total Spent", value: `₦${totalSpent.toLocaleString()}`, color: "var(--color-text-primary)" },
//       ].map(s => (
//         <div key={s.label} className="rounded-2xl p-3.5 border border-gray-100 dark:border-white/8 bg-white dark:bg-white/5">
//           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{s.label}</p>
//           <p className="text-[18px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

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
      style={{ background: "#7C3AED1c" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="3" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    </div>
    <p className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">No transactions yet</p>
    <p className="text-[13px] text-gray-400 mb-5">Top up to get started</p>
    <button onClick={onTopUp} className="px-5 py-2.5 text-[13px] font-bold active:scale-95 transition-transform"
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
  const [cards, setCards]     = useState(DEMO_CARDS);
  const [adding, setAdding]   = useState(false);
  return (
    <div className="pb-10">
      {/* Header */}
      <WalletCard balance={balance} onTopUp={() => {navigate('/octacoin')}} onCashOut={() => {navigate('/withdraw')}} />
      
      {/* <div className="flex items-center justify-between mb-5">
        <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div> */}

        <BankCards
          cards={cards}
          onAddBank={() => setAdding(true)}
        />
      
      <BottomSheet title="Add Bank Account" isOpen={adding} onClose={() => setAdding(false)}>
        <AddBankForm
          onSuccess={(card) => {
            setCards((prev) => [...prev, card]);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      </BottomSheet>

      {/* Transaction History */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Transaction History</h2>
        <button className="text-sm font-semibold text-[#7C3AED] p-2 rounded-[15px]" onClick={() => {navigate('/transaction')}}>See all </button>
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

export default function WalletCard() {
  ({ 
  balance,
  nairaValue,
  onTopUp,
  onCashOut,
}: {
  balance: number;
  nairaValue: number;
  onTopUp?: () => void;
  onCashOut?: () => void;
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-3xl p-5 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-3xl font-bold">{balance} HPR</p>
          <p className="text-sm opacity-80 mt-2">₦{nairaValue.toFixed(2)}</p>
        </div>

        <div className="bg-white/20 p-3 rounded-full">
          ⚙️
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onTopUp}
          className="flex-1 bg-white text-purple-600 py-3 rounded-xl font-semibold"
        >
          + Top up
        </button>

        <button
          onClick={onCashOut}
          className="flex-1 bg-white/20 py-3 rounded-xl font-semibold"
        >
          ↗ Cash out
        </button>
      </div>
    </div>
  );
};
}
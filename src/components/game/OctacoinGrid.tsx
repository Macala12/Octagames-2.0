import React from "react";
import coin from "../../images/coin.png";

interface CoinPack {
  id: string;
  coins: number;
  price: number;
  best_value?: boolean;
  bonus?: string | null;
}

interface Props {
  limit?: number;
  currency?: string;
  currentBalance?: number;
}

const coinPacks: CoinPack[] = [
  { id: "1", coins: 100,  price: 500,   best_value: false, bonus: null },
  { id: "2", coins: 250,  price: 1000,  best_value: false, bonus: null },
  { id: "3", coins: 500,  price: 2000,  best_value: false, bonus: "+50 free" },
  { id: "4", coins: 1000, price: 3500,  best_value: true,  bonus: "+150 free" },
  { id: "5", coins: 2500, price: 8000,  best_value: false, bonus: "+300 free" },
  { id: "6", coins: 5000, price: 15000, best_value: false, bonus: "+700 free" },
];

const coinSizes = ["w-7 h-7", "w-8 h-8", "w-9 h-9", "w-10 h-10", "w-12 h-12", "w-14 h-14"];

const ACCENT = "#09f2a6";

export default function OctaCoinGrid({
  limit = 6,
  currency = "₦",
  currentBalance = 0,
}: Props) {
  const displayedPacks = coinPacks.slice(0, limit);

  const handleSelect = (pack: CoinPack) => {
    window.location.href = `/checkout?pack=${pack.id}`;
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[17px] font-semibold text-gray-900 dark:text-white">
            Top up Octacoins
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Select a pack to continue</p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5">
          <img src={coin} alt="coin" className="w-6 h-6 object-contain" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {displayedPacks.map((pack, i) => (
          <div
            key={pack.id}
            onClick={() => handleSelect(pack)}
            className="relative rounded-2xl text-center cursor-pointer overflow-hidden
              bg-white dark:bg-white/5 active:scale-95 transition-transform"
            style={{
              border: pack.best_value
                ? `2px solid ${ACCENT}`
                : "0.5px solid rgba(0,0,0,0.08)",
              padding: pack.best_value ? "0 10px 12px" : "14px 10px 10px",
            }}
          >
            {/* Best value banner */}
            {pack.best_value && (
              <div
                className="text-[9px] font-bold uppercase tracking-wide py-1 mb-3 -mx-0"
                style={{ background: ACCENT, color: "#022b1e" }}
              >
                Best Value
              </div>
            )}

            {/* Coin image — grows with tier */}
            <div className="flex justify-center items-center h-14 mb-2">
              <div
                className={`rounded-full flex items-center justify-center`}
                style={{
                  background: pack.best_value ? "rgba(9,242,166,0.12)" : "rgba(0,0,0,0.04)",
                  border: pack.best_value
                    ? `1.5px solid rgba(9,242,166,0.4)`
                    : "0.5px solid rgba(0,0,0,0.06)",
                }}
              >
                <img src={coin} alt="Octacoin" className="w-15 h-15" />
              </div>
            </div>

            {/* Coin count */}
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {pack.coins.toLocaleString()}
            </p>

            {/* Bonus label */}
            {pack.bonus ? (
              <p className="absolute top-1 right-3 text-[10px] font-semibold mt-0.5" style={{ color: ACCENT }}>
                <b>{pack.bonus}</b>
              </p>
            ) : (
              <div className="" />
            )}

            {/* Price pill */}
            <div className="mt-2 bg-gray-100 dark:bg-white/10 rounded-full pt-1 pb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-white/60">
                {currency}{pack.price.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
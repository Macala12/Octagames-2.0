import coin from "../../images/coin.png";
// import { useState } from "react";
// import BottomSheet from "../ui/bottom-sheet/BottomSheet";
// import PaymentOptions from "../ui/bottom-sheet/OctacoinSheet";

// interface CoinPack {
//   id: string;
//   coins: number;
//   price: number;
//   best_value?: boolean;
//   bonus?: string | null;
// }

interface Props {
  limit?: number;
  currency?: string;
  currentBalance?: number;
}

// const coinPacks: CoinPack[] = [
//   { id: "1", coins: 100,  price: 500,   best_value: false, bonus: null },
//   { id: "2", coins: 250,  price: 1000,  best_value: false, bonus: null },
//   { id: "3", coins: 500,  price: 2000,  best_value: false, bonus: "+50 free" },
//   { id: "4", coins: 1000, price: 3500,  best_value: true,  bonus: "+150 free" },
//   { id: "5", coins: 2500, price: 8000,  best_value: false, bonus: "+300 free" },
//   { id: "6", coins: 5000, price: 15000, best_value: false, bonus: "+700 free" },
// ];

// const ACCENT = "#7C3AED";

export default function OctaCoinGrid({
  // limit = 6,
  // currency = "₦",
  currentBalance = 0,
}: Props) {
  // const [open, setOpen] = useState(false);
  // const displayedPacks = coinPacks.slice(0, limit);

  // const handleSelect = (pack: CoinPack) => {
  //   setOpen(true);
  //   console.log(pack);
  //   // window.location.href = `/checkout?pack=${pack.id}`;
  // };

  return (
    <div className="mt-10">
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
    </div>
  );
}
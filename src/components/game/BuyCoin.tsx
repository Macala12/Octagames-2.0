import React from "react";

interface Props {
  rate?: number; // Octacoins per currency unit
  currency?: string;
}

const BuyOctaCoinsCard: React.FC<Props> = ({
}) => {
  return (
    <div className="mt-6 rounded-xl p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[20px] font-semibold">Low on Octacoin</h3>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          Instant Delivery ⚡
        </span>
      </div>

      {/* Content */}
      <div className="mt-4 relative z-10">
        <p className="text-xs opacity-90">
          Boost your gameplay, unlock rewards, and enter premium tournaments.
        </p>

        {/* Rate Display */}
        {/* <div className="mt-4 bg-white/20 rounded-lg p-3 text-center">
          <p className="text-lg font-bold">
            {currency}1 = {rate} Octacoins 🪙
          </p>
          <p className="text-xs opacity-80 mt-1">
            Best value for competitive players
          </p>
        </div> */}

        {/* CTA */}
        <button className="mt-4 w-50 bg-white text-purple-600 font-semibold py-2 rounded-[20px] active:scale-95 transition">
          Buy Now 🚀
        </button>

        {/* Small hint */}
        <p className="text-[11px] mt-2 opacity-80 text-center">
          Secure payments • Instant credit • No delays
        </p>
      </div>
    </div>
  );
};

export default BuyOctaCoinsCard;
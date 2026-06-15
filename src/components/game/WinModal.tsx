import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  amount: number;
  streak?: number;
  percentageBetter?: number;
  onClose: () => void;
}

export default function WinModal({
  isOpen,
  amount,
  streak = 1,
  percentageBetter = 0,
  onClose,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* 🎉 Card */}
      <div
        className={`bg-[#0a0a0a] rounded-3xl p-6 w-[90%] max-w-sm text-center transform transition-all duration-500 ${
          show ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-10 opacity-0"
        }`}
      >
        {/* 🎊 Emoji / Icon */}
        <div className="text-5xl mb-3">🎉</div>

        {/* Title */}
        <h2 className="text-lg text-gray-200">
          <span className="text-brand-400 font-semibold">
            Congratulations!
          </span>{" "}
          you won 🥳
        </h2>

        {/* 💰 Amount */}
        <h1 className="text-3xl font-bold mt-3">
          +₦{amount.toLocaleString()}
        </h1>

        {/* 🔥 Streak */}
        <p className="mt-3 text-gray-300">
          🔥 <span className="text-brand-400 font-semibold">{streak}</span>{" "}
          winning streak
        </p>

        {/* 📊 Stats */}
        {percentageBetter > 0 && (
          <p className="mt-3 text-sm text-gray-400">
            You have won{" "}
            <span className="text-brand-400 font-semibold">
              {percentageBetter}%
            </span>{" "}
            more than other players today.
          </p>
        )}

        {/* Extra */}
        <p className="mt-2 text-sm text-gray-400">
          Keep <span className="text-brand-400">playing</span> and keep{" "}
          <span className="text-brand-400">winning</span>
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-brand-400 text-black py-3 rounded-full font-semibold"
        >
          Got it!
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-4">
          ⚡ Powered by Octagames
        </p>
      </div>
    </div>
  );
}
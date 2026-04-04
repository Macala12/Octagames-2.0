// 🔷 Types
interface Referral {
  id: string;
  username: string;
  dateJoined: string;
  status: "success" | "pending";
}

interface Props {
  referralCode?: string;
  referralLink?: string;
  totalEarned?: number;
  referrals?: Referral[];
  onBack?: () => void;
}

// 🔷 Helpers
const getStatusColor = (status: string) => {
  if (status === "success") return "text-green-500";
  if (status === "pending") return "text-yellow-400";
  return "text-gray-400";
};

// 🔷 WhatsApp Share
const shareToWhatsApp = (link: string, code: string) => {
  const message = `🔥 Join me on Octagames and win real rewards!\n\nUse my referral code: ${code}\n\nPlay here: ${link}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

// 🔷 Main Component
export default function ReferralScreen({
  referralCode = "OCTA123",
  referralLink = "https://octagames.app/ref/OCTA123",
  totalEarned = 0,
  referrals = [],
  onBack,
}: Props) {
  return (
    <div className="bg-black min-h-screen text-white p-4">
      {/* 🔝 Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-black"
        >
          ←
        </button>

        <button className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-black">
          i
        </button>
      </div>

      {/* 🎁 Hero */}
      <div>
        <h1 className="text-2xl font-bold leading-snug">
          Get <span className="text-teal-400">₦300</span> in Octacoins when
          you <span className="text-teal-400">refer</span> a friend 🎁🎉
        </h1>

        <p className="text-sm text-gray-300 mt-3">
          Invite your friends and earn rewards while you play!
        </p>
      </div>

      {/* 💰 Earnings Card */}
      <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4">
        <p className="text-sm opacity-80">You’ve earned</p>
        <p className="text-2xl font-bold mt-1">
          ₦{totalEarned.toLocaleString()} 💰
        </p>
      </div>

      {/* 🧾 Referral Code */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-2">Your referral code</p>

        <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
          <span className="font-semibold tracking-widest">
            {referralCode}
          </span>

          <button
            onClick={() => navigator.clipboard.writeText(referralCode)}
            className="text-teal-400 text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      {/* 🔗 Referral Link */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Referral link</p>

        <div className="bg-white/10 rounded-xl p-3 text-sm truncate">
          {referralLink}
        </div>
      </div>

      {/* 🚀 ACTION BUTTONS */}
      <div className="mt-5 space-y-3">
        {/* WhatsApp (PRIMARY CTA) */}
        <button
          onClick={() => shareToWhatsApp(referralLink, referralCode)}
          className="w-full bg-green-500 py-3 rounded-full font-semibold text-black"
        >
          Share on WhatsApp 🟢
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigator.clipboard.writeText(referralLink)
            }
            className="flex-1 bg-teal-400 text-black py-2 rounded-full font-semibold"
          >
            Copy link
          </button>

          <button
            onClick={() =>
              navigator.share?.({
                title: "Join Octagames",
                text: `Use my code ${referralCode}`,
                url: referralLink,
              })
            }
            className="flex-1 bg-teal-400 text-black py-2 rounded-full font-semibold"
          >
            Share
          </button>
        </div>
      </div>

      {/* 📜 Referral History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Referral History
        </h2>

        <div className="bg-white/10 rounded-2xl p-4 space-y-4">
          {/* Header */}
          <div className="grid grid-cols-4 text-sm text-gray-400">
            <p>S/N</p>
            <p>Username</p>
            <p>Date Joined</p>
            <p>Status</p>
          </div>

          {referrals.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              No referrals yet
            </p>
          ) : (
            referrals.map((ref, index) => (
              <div
                key={ref.id}
                className="grid grid-cols-4 text-sm"
              >
                <p>{index + 1}</p>
                <p className="truncate">{ref.username}</p>
                <p className="text-xs text-gray-300">
                  {ref.dateJoined}
                </p>
                <p className={getStatusColor(ref.status)}>
                  {ref.status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
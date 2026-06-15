import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  prize?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "You won 🥳 2,000",
    subtitle: "You finished 1ST in the Kong Climb tournament you entered.",
    emoji: "🎉",
    prize: "2,000"
  },
  {
    id: 2,
    title: "New tournament starting soon!",
    subtitle: "Battle Royale with 10,000 victory pot. Join now!",
    emoji: "⚔️",
    prize: "10,000"
  },
  {
    id: 3,
    title: "Daily reward available!",
    subtitle: "Claim your 500 bonus before it expires in 24 hours.",
    emoji: "🎁",
    prize: "500"
  },
  {
    id: 4,
    title: "You leveled up!",
    subtitle: "Reached Diamond rank. Exclusive rewards unlocked.",
    emoji: "💎",
    prize: "Diamond"
  }
];

const NotificationCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
//   const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        // Start animation: current slides up/out, next slides in
        setIsAnimating(true);
        
        // After animation completes, update indices
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % notifications.length);
        //   setNextIndex((prev) => (prev + 1) % notifications.length);
          setIsAnimating(false);
        }, 500); // Match animation duration
      }
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentNotification = notifications[currentIndex];
  const nextNotification = notifications[(currentIndex + 1) % notifications.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hyper works best with notifications</h1>
          <p className="text-gray-400 text-sm">Be the first to know about tournaments with huge victory pots. We only send what matters to you.</p>
        </div>

        {/* Notification Card - Animated Container */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden mb-6 min-h-[200px]">
          {/* Current Notification - Sliding up and fading out */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isAnimating
                ? 'transform -translate-y-full opacity-0'
                : 'transform translate-y-0 opacity-100'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{currentNotification.emoji}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{currentNotification.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{currentNotification.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Decorative prize indicator */}
              {currentNotification.prize && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full">
                    <span className="text-yellow-300">🏆</span>
                    <span className="text-white text-sm font-semibold">Prize: {currentNotification.prize}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Notification - Preparing to slide in from bottom */}
          <div
            className={`absolute top-0 left-0 right-0 transition-all duration-500 ease-in-out ${
              isAnimating
                ? 'transform translate-y-0 opacity-100'
                : 'transform translate-y-full opacity-0'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{nextNotification.emoji}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{nextNotification.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{nextNotification.subtitle}</p>
                  </div>
                </div>
              </div>

              {nextNotification.prize && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full">
                    <span className="text-yellow-300">🏆</span>
                    <span className="text-white text-sm font-semibold">Prize: {nextNotification.prize}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
            Enable notification
          </button>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-700">
            Maybe later
          </button>
        </div>

        {/* Notification dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {notifications.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
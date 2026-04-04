export default function TournamentSection() {
  return (
    <div className="space-y-8">
      {/* My Tournament */}
      <div>
        <h2 className="text-xl font-bold mb-2">My Tournament</h2>
        <p className="text-gray-400 mb-4">
          Your ongoing tournaments, all lined up for you.
        </p>

        <div className="bg-gray-800 p-6 rounded-xl text-center">
          You have no <span className="text-teal-400">active / joined</span> tournament
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-bold mb-2">Tournament History</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Card */}
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="h-24 bg-gray-700 rounded mb-2"></div>
            <h3 className="font-bold">Tower Master</h3>
            <p className="text-sm text-gray-400">Reward: ₦19050</p>

            <div className="flex mt-3">
              <button className="flex-1 bg-black text-white py-1 rounded-l-lg">
                Ended
              </button>
              <button className="flex-1 bg-green-500 py-1 rounded-r-lg">
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
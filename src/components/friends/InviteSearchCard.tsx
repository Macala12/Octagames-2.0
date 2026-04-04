export default function InviteSearchCard() {
  return (
    <div className="space-y-6">
      {/* Invite Card */}
      <div className="bg-teal-400 text-black rounded-2xl p-4 flex gap-4 items-center">
        <div className="text-3xl">⚔️</div>
        <div>
          <h3 className="font-bold text-lg">Play with your friends</h3>
          <p className="text-sm">
            Invite your friends, compete together, and see who tops the leaderboard.
          </p>
        </div>
      </div>

      {/* Search */}
      <div>
        <h3 className="font-semibold mb-1">Search for a friends game</h3>
        <p className="text-sm text-gray-400 mb-3">
          Enter a game code to join a private game created by your friend.
        </p>

        <input
          placeholder="Type game code"
          className="w-full bg-gray-800 p-4 rounded-xl outline-none"
        />
      </div>
    </div>
  );
}
import React from "react";

export interface Player {
  id: string;
  username: string;
  avatar: string;
  rank: 1 | 2 | 3;
  rankImage?: string;
}

// 🔷 SVG Fallback for Rank
const RankFallback = ({ rank }: { rank: number }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="80"
        fontWeight="bold"
        fill="#12b76a"
      >
        {rank}
      </text>
    </svg>
  );
};

// 🔷 Rank Display (Image → fallback to SVG)
const RankDisplay = ({
  rank,
  image,
}: {
  rank: number;
  image?: string;
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={`rank-${rank}`}
        className="absolute -left-13 top-0 z-0 inset-0 w-full h-[30%] object-contain pointer-events-none"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="absolute -left-27 top-5 inset-0 flex items-center justify-center opacity-20 pointer-events-none">
      <RankFallback rank={rank} />
    </div>
  );
};

// 🔷 Player Card
const PlayerCard = ({ player }: { player: Player }) => {
  return (
<div className="relative z-10 bg-white/10 mr-8 rounded-2xl p-4 flex flex-col items-center justify-center w-[100px] h-[110px]">
      {/* Rank Background */}
      <RankDisplay rank={player.rank} image={player.rankImage} />

      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden z-10 border-2 border-white/20">
        <img
          src={player.avatar}
          alt={player.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Username */}
      <p className="mt-2 text-sm font-semibold text-white z-10 truncate max-w-[90px] text-center">
        {player.username}
      </p>
    </div>
  );
};

// 🏆 MAIN COMPONENT
interface Props {
  players: Player[];
}

export default function TopPlayers({ players }: Props) {
  return (
    <div className="rounded-2xl">
      {/* Title */}
      <h2 className="text-white font-bold text-md mb-4">
        Top Players in Nigeria 🇳🇬
      </h2>

      {/* Players Row */}
      <div className="flex justify-between pl-2 pr-2 items-end gap-3">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
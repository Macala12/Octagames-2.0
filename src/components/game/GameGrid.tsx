import React from "react";

interface Game {
  id: string;
  title: string;
  image: string;
  plays: number;
}

interface GameGridProps {
  games: Game[];
  onGameClick?: (game: Game) => void;
  onClick?: () => void;
}

const formatPlays = (plays: number) => {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${Math.floor(plays / 1000)}K`;
  return plays.toString();
};

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  onGameClick,
}) => {
  return (
    <div className="w-90 h-[100%] overflow-x-auto no-scrollbar grid grid-cols-3 sm:grid-cols-3 gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          onClick={() => onGameClick?.(game)}
          className="cursor-pointer group"
        >
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src={game.image}
              alt={game.title}
              className="w-100 h-[100%] object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Info */}
          <div className="mt-2 text-white">
            <h3 className="text-sm text-white font-semibold text-gray-800 truncate">
              {game.title}
            </h3>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <span>▶</span>
              <span>{formatPlays(game.plays)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
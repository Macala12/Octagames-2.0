import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Game {
  id: string;
  title: string;
  image: string;
  provider?: string;
  accentColor?: string; // e.g. "#7B5CF6" — drives border + gradient overlay
}

interface GameGridProps {
  games: Game[];
  columns?: 2 | 3 | 4;
  onGameClick?: (game: Game) => void;
}

// ─── Colour palette — one per "mood", cycles if unset ────────────────────────

const ACCENT_PALETTE = [
  "#6C5CE7", // purple  — Gates of Olympus
  "#E53E3E", // red     — Strawberry Cocktail
  "#38A169", // green   — John Hunter
  "#DD6B20", // orange  — Texas Holdem
  "#C53030", // dark red — Possessed
  "#D53F8C", // pink    — Crazy Time
  "#B7791F", // amber   — Wanted Dead or Wild
  "#4A5568", // slate   — Book of Shadows
];

// ─── Single Card ─────────────────────────────────────────────────────────────

interface GameCardProps {
  game: Game;
  accentColor: string;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, accentColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer select-none group"
      style={{ borderRadius: 16 }}
    >
      {/* Outer glow border — matches accent colour */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-200 group-hover:opacity-100"
        style={{
          opacity: 0.85,
          borderRadius: 16,
          zIndex: 2,
          pointerEvents: "none",
          boxShadow: `0 0 12px 2px ${accentColor}55`,
        }}
      />

      {/* Card body */}
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: 14 }}
      >
        {/* Game artwork */}
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ display: "block" }}
          />

          {/* Bottom gradient overlay — darkens lower third for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                transparent 35%,
                ${accentColor}99 70%,
                ${accentColor}EE 100%
              )`,
            }}
          />

          {/* Title + provider — sits over gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6"
            style={{ zIndex: 1 }}
          >
            <h3
              className="text-white font-black uppercase leading-none tracking-wide"
              style={{
                fontSize: "clamp(13px, 2.2vw, 18px)",
                lineHeight: 1.15,
                marginBottom: 5,
              }}
            >
              {game.title}
            </h3>

            {game.provider && (
              <p
                className="text-white/75 font-medium"
                style={{
                  fontSize: "clamp(9px, 1.1vw, 12px)",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                {game.provider}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hover play overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          borderRadius: 14,
          background: "rgba(0,0,0,0.35)",
          zIndex: 3,
          backdropFilter: "blur(1px)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 52,
            height: 52,
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 4l12 6-12 6V4z" fill={accentColor} />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  columns = 4,
  onGameClick,
}) => {
  const colClass: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid gap-3 sm:gap-4 ${colClass[columns]}`}
      style={{ background: "transparent" }}
    >
      {games.map((game, i) => {
        const accent =
          game.accentColor ?? ACCENT_PALETTE[i % ACCENT_PALETTE.length];
        return (
          <GameCard
            key={game.id}
            game={game}
            accentColor={accent}
            onClick={() => onGameClick?.(game)}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;

/* ─────────────────────────────────────────────────────────────────────────────
   USAGE EXAMPLE
   ─────────────────────────────────────────────────────────────────────────────

import { GameGrid } from "./GameGrid";

const GAMES = [
  {
    id: "1",
    title: "Gates of Olympus",
    provider: "Pragmatic Play",
    image: "https://your-cdn.com/gates-of-olympus.jpg",
    accentColor: "#6C5CE7",   // optional — falls back to palette if omitted
  },
  {
    id: "2",
    title: "Strawberry Cocktail",
    provider: "Pragmatic Play",
    image: "https://your-cdn.com/strawberry-cocktail.jpg",
    accentColor: "#E53E3E",
  },
  {
    id: "3",
    title: "John Hunter and the Gods",
    provider: "Pragmatic Play",
    image: "https://your-cdn.com/john-hunter.jpg",
    accentColor: "#38A169",
  },
  {
    id: "4",
    title: "Texas Holdem Bonus Poker",
    provider: "Evolution",
    image: "https://your-cdn.com/texas-holdem.jpg",
    accentColor: "#DD6B20",
  },
];

<div style={{ background: "#0a0a0a", padding: 24 }}>
  <GameGrid
    games={GAMES}
    columns={4}
    onGameClick={(game) => console.log("Clicked:", game.title)}
  />
</div>

   PROPS
   ─────────────────────────────────────────────────────────────────────────────
   games          Game[]       Array of game objects (required)
   columns        2 | 3 | 4   Grid column count (default: 4)
   onGameClick    fn(game)     Called when a card is clicked

   GAME OBJECT FIELDS
   ─────────────────────────────────────────────────────────────────────────────
   id             string       Unique key
   title          string       Game name — displayed in ALL CAPS bold
   image          string       URL to game artwork (portrait ratio recommended)
   provider       string?      Studio name shown below title (optional)
   accentColor    string?      Hex colour for border + gradient (optional)
                               Falls back to built-in 8-colour palette if omitted
   ───────────────────────────────────────────────────────────────────────────── */
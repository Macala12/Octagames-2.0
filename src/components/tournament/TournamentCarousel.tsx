import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Tournament {
  id: string;
  title: string;
  image?: string;
  playersCount: number;
  minCoins: number;
  maxCoins: number;
  endTime: string;
  prize: string;
  tag?: string;
  bg?: string;
  accentColor?: string;
}

interface Props {
  tournaments: Tournament[];
  onPlay?: (tournament: Tournament) => void;
}

const ACCENT = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
      );
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return timeLeft;
}

function TournamentCard({
  tournament,
  onPlay,
}: {
  tournament: Tournament;
  onPlay?: (t: Tournament) => void;
}) {
  const navigate = useNavigate();
  const timeLeft = useCountdown(tournament.endTime);
  const bg = "#0a0a0a";
  const accent = "#0a0a0a";

  return (
    <div
      onClick={() => navigate('/tournament')}
      className="w-[260px] flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
    >
      {/* Image / Hero area */}
      <div className="relative h-[250px] pl-1 pr-1 flex items-center justify-center overflow-hidden">
        {tournament.image ? (
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-[100%] object-cover rounded-[20px]"
          />
        ) : (
          <>
            <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full opacity-20"
              style={{ background: accent }} />
            <div className="absolute -bottom-10 -left-8 w-32 h-32 rounded-full opacity-10"
              style={{ background: accent }} />
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none"
              stroke={accent} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: 0.55 }}>
              <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2M6 4h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4zM9 21v-5h6v5" />
            </svg>
          </>
        )}

        {/* Tag badge */}
        {tournament.tag && (
          <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 z-10"
            style={{ background: ACCENT }}>
            <span className="text-[10px] font-extrabold tracking-wide"
              style={{ color: ACCENT_TEXT }}>{tournament.tag}</span>
          </div>
        )}

        {/* Players count */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 z-10"
          style={{ background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-[10px] font-semibold text-white/90">
            {tournament.playersCount}
          </span>
        </div>       
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3 w-[260px] rounded-[10px] bg-black -mt-20 relative z-10">
        <p className="text-[16px] font-extrabold text-white tracking-tight mb-2.5">
          {tournament.title}
        </p>

        <div className="flex justify-between items-center mb-3.5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1">Prize Pool</p>
            <p className="text-[18px] font-extrabold text-white">{tournament.prize}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1">Entry</p>
            <p className="text-xs font-bold text-white/70">
              🪙 {tournament.minCoins.toLocaleString()} – {tournament.maxCoins.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/8 mb-3.5" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1">Ends in</p>
            <p className="text-sm font-extrabold text-white tracking-wide">{timeLeft}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onPlay?.(tournament); }}
            className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-extrabold active:scale-95 transition-transform"
            style={{ background: ACCENT, color: ACCENT_TEXT }}
          >
            Play
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export const TournamentCarousel: React.FC<Props> = ({ tournaments, onPlay }) => {
  return (
    <div className="mt-2">
      <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar">
        {tournaments.map((t) => (
          <TournamentCard key={t.id} tournament={t} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
};
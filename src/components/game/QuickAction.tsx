import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import gameImg from "../../images/towermaster.png";
import gameImg2 from "../../images/subway.jpeg";
import BottomSheet from "../ui/bottom-sheet/BottomSheet";
import PlayStrangerContent from "../bottom-sheet-components/PlayStranger";

interface ActionItem {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
  cta: string;
  badge?: string;
  bg: string;
  iconBg: string;
  iconBorder: string;
  decorColor: string;
}

const games = [
  {
    id: "1",
    title: "Grab The Sushi",
    image: gameImg,
    plays: 236000,
  },
  {
    id: "2",
    title: "Samurai Rampage",
    image: gameImg2,
    plays: 109000,
  },
  {
    id: "3",
    title: "Dart Master",
    image: "/images/dart.jpg",
    plays: 300000,
  },
];

const actions: ActionItem[] = [
  {
    title: "Play with Friend",
    subtitle: "Invite & challenge someone you know",
    cta: "Invite",
    path: "/challenge/friend",
    bg: "#1a0533",
    iconBg: "rgba(167,139,250,0.2)",
    iconBorder: "rgba(167,139,250,0.3)",
    decorColor: "rgba(167,139,250,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        <path d="M17 14c1.7.4 3 1.8 3 3.5" strokeDasharray="2 1.5" />
      </svg>
    ),
  },
  {
    title: "Play with Stranger",
    subtitle: "Match instantly with a random player",
    cta: "Match Now",
    badge: "Win ₦1,000",
    path: "/challenge/random",
    bg: "#001a33",
    iconBg: "rgba(56,189,248,0.15)",
    iconBorder: "rgba(56,189,248,0.25)",
    decorColor: "rgba(56,189,248,0.12)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const ACCENT = "#09f2a6";

const QuickActions: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={''}
            className="relative rounded-[20px] p-4 flex flex-col justify-between overflow-hidden active:scale-[0.97] transition-transform"
            style={{ background: action.bg, minHeight: 170 }}
            onClick={() => setOpen(true)}
          >
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: action.decorColor }} />
            <div className="absolute bottom-5 right-5 w-14 h-14 rounded-full pointer-events-none"
              style={{ background: action.decorColor, opacity: 0.6 }} />

            {/* Win badge */}
            {action.badge && (
              <div className="absolute top-3.5 right-3.5 rounded-full px-2 py-0.5"
                style={{ background: "rgba(9,242,166,0.15)", border: "1px solid rgba(9,242,166,0.3)" }}>
                <span className="text-[10px] font-bold" style={{ color: ACCENT }}>
                  {action.badge}
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ background: action.iconBg }}>
              {action.icon}
            </div>

            {/* Text + CTA */}
            <div className="mt-4">
              <p className="text-[15px] font-bold text-white mb-1">{action.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {action.subtitle}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5"
                style={{ background: ACCENT }}>
                <span className="text-[11px] font-bold" style={{ color: "#022b1e" }}>{action.cta}</span>
                <span className="text-[11px]" style={{ color: "#022b1e" }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* <!-- Card End --> */}
      <BottomSheet title="Challenge a stranger" subtitle="Find and challenge a stranger, win cash prize" isOpen={open} onClose={() => setOpen(false)}>
        <PlayStrangerContent
          games={games}
          balance={500}
          onProceed={(data) => {
            console.log(data);
            // trigger matchmaking here
          }}
        />
      </BottomSheet>
    </div>
  );
};

export default QuickActions;
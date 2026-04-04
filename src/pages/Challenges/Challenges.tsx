import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ChallengeList from "../../components/cards/ChallengesCard";
import ChallengeDetail from "../../components/ui/bottom-sheet/ChallengerSheet";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

export default function Challenges() {
  const [open, setOpen] = useState(false);
  const [openedChallenge, setChallenge] = useState<Challenge | null>(null);

interface Challenge {
  id: string;
  gameTitle: string;
  description: string;
  targetScore: number;
  reward: number;
  image?: string;
  label?: string;
  color?: "purple" | "gold" | "green" | "blue";
}

interface ChallengeDetailData {
  gameTitle: string;
  description?: string;
  image?: string;
  players: number;
  tiers: Tier[];
  reward: number;
}

interface Tier {
  id: string;
  label: string;
  emoji: string;
  scoreRange: string;
  multiplier: number;
  accent: string;
  border: string;
}
  
// const challenges = [
//   {
//     id: "1",
//     gameTitle: "Subway Surfer",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
//     targetScore: 5000,
//     reward: 1000,
//     color: "purple",
//     players: 30,
//     tiers: [
//       { label: "Lose 😢", multiplier: 0.5, scoreRange: "0 - 6" },
//       { label: "Win 🏆", multiplier: 1.5, scoreRange: "7 - 14" },
//       { label: "Win 💰", multiplier: 2, scoreRange: "15 - 25" },
//     ]
//   },
//   {
//     id: "2",
//     gameTitle: "8 Ball Pool",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
//     targetScore: 3000,
//     reward: 700,
//     color: "gold",
//     players: 30,
//     tiers: [
//       { label: "Lose 😢", multiplier: 0.5, scoreRange: "0 - 6" },
//       { label: "Win 🏆", multiplier: 1.5, scoreRange: "7 - 14" },
//       { label: "Win 💰", multiplier: 2, scoreRange: "15 - 25" },
//     ]
//   },
//   {
//     id: "3",
//     gameTitle: "Dart Master",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
//     targetScore: 2000,
//     reward: 500,
//     color: "green",
//     players: 30,
//     tiers: [
//       { label: "Lose 😢", multiplier: 0.5, scoreRange: "0 - 6" },
//       { label: "Win 🏆", multiplier: 1.5, scoreRange: "7 - 14" },
//       { label: "Win 💰", multiplier: 2, scoreRange: "15 - 25" },
//     ]
//   },
// ];

const challengeCardList: Challenge[]  = [
  {
    id: "1",
    gameTitle: "Subway Surfer",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
    targetScore: 5000,
    reward: 1000,
    image: "lorem",
    label: "label",
    color: "purple",
  },
  {
    id: "2",
    gameTitle: "8 Ball Pool",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
    targetScore: 5000,
    reward: 1000,
    image: "lorem",
    label: "label",
    color: "blue",
  },
  {
    id: "3",
    gameTitle: "Dart Master",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, magni.",
    targetScore: 5000,
    reward: 1000,
    image: "lorem",
    label: "label",
    color: "green",
  },
];

const detailData: ChallengeDetailData | null = openedChallenge
  ? {
      gameTitle: openedChallenge.gameTitle,
      description: openedChallenge.description,
      image: openedChallenge.image,
      players: 1200, // you’ll fetch this from backend later
      reward: openedChallenge.reward,
      tiers: [], // or map dynamically
    }
  : null;

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | Octagames - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-2 dark: xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          <div className="flex items-center mt-5 justify-between mb-5">
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">Challenges</h1>
              <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
            </div>
            <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10  border-gray-200 dark:border-white/10">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
        <ChallengeList
          challenges={challengeCardList}
          onClick={(challenge) => {
            setChallenge(challenge);
            setOpen(true);
          }}
        />
        <BottomSheet title="Challenge Detail" isOpen={open} onClose={() => setOpen(false)}>
          {detailData && (
            <ChallengeDetail data={detailData} />
          )}     
        </BottomSheet>
        </div>
      </div>
    </div>
  );
}

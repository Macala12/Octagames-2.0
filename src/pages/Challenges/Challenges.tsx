import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ChallengeList from "../../components/cards/ChallengesCard";
import ChallengeDetail from "../../components/ui/bottom-sheet/ChallengerSheet";
// import ChallengeInfo from "../../components/ui/bottom-sheet/ChallengesSheet";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";
import SpecialTournamentCard from "../../components/tournament/SpecialTournament";
import NeubrutalistCard from "../../components/ui/cards/NeuCard";
import gameImg2 from "../../images/subway.jpeg";
// import { StepsList } from "../../components/cards/HowToChallenges";
// import CardDeckCarousel from "../../components/carousel/CardCarousel";
import SpinAndWin from "../../components/cards/SpintheWheel";
import SpinWheel from "../../components/gamifications/SpindaWheel";

export default function Challenges() {
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(true);
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


const tournament = [
  {
    id:            "1",
    title:         "8 Ball Pool Championship",
    image:         gameImg2,           // keep your existing import
    bg:            "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)", // fallback gradient
    accentColor:   "#3b82f6",          // pool blue accent
    publisher:     "Octagames Studio",
    publisherIcon: "https://api.dicebear.com/9.x/identicon/svg?seed=Octagames&backgroundColor=b6e3f4", // optional: add a publisher icon
    tag:           "LIVE",
    prize:         "₦3,000",           // per-winner prize (shown with trophy)
    prizePool:     "₦50,000",          // total prize pool (shown as hero number)
    playersCount:  16,
    maxPlayers:    50,
    minCoins:      202,
    maxCoins:      675,
    endTime:       "2026-06-12T12:00:00Z",
    difficulty:    "medium" as const,
    playerAvatars: [
      "https://api.dicebear.com/9.x/big-smile/svg?seed=AmakaO&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=KwameD&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=8c5a2b,a47539,c99c62,e0ac69&backgroundColor=ffdfbf,ffd5dc,c0aede,b6e3f4",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=FatimaT&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=a47539,c99c62,e0ac69,f5d0b5&backgroundColor=d1d4f9,c0aede,ffd5dc,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=SiphoM&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539&backgroundColor=b6e3f4,d1d4f9,c0aede,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=ZaraK&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=c99c62,e0ac69,f5d0b5&backgroundColor=ffd5dc,ffdfbf,c0aede,b6e3f4,d1d4f9"
    ],
    topScore:      8450,
    yourScore:     5120,
    yourRank:      4,
    isJoined:      false,
    rating:        4.2,                // NEW: 1-5 star rating
    ratingCount:   128,                // NEW: number of players who rated
  },
  {
    id:            "1",
    title:         "8 Ball Pool Championship",
    image:         gameImg2,           // keep your existing import
    bg:            "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)", // fallback gradient
    accentColor:   "#3b82f6",          // pool blue accent
    publisher:     "Octagames Studio",
    publisherIcon: "https://api.dicebear.com/9.x/identicon/svg?seed=Octagames&backgroundColor=b6e3f4", // optional: add a publisher icon
    tag:           "LIVE",
    prize:         "₦3,000",           // per-winner prize (shown with trophy)
    prizePool:     "₦50,000",          // total prize pool (shown as hero number)
    playersCount:  16,
    maxPlayers:    50,
    minCoins:      202,
    maxCoins:      675,
    endTime:       "2026-06-12T12:00:00Z",
    difficulty:    "medium" as const,
    playerAvatars: [
      "https://api.dicebear.com/9.x/big-smile/svg?seed=AmakaO&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=KwameD&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=8c5a2b,a47539,c99c62,e0ac69&backgroundColor=ffdfbf,ffd5dc,c0aede,b6e3f4",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=FatimaT&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=a47539,c99c62,e0ac69,f5d0b5&backgroundColor=d1d4f9,c0aede,ffd5dc,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=SiphoM&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539&backgroundColor=b6e3f4,d1d4f9,c0aede,ffdfbf",
      "https://api.dicebear.com/9.x/big-smile/svg?seed=ZaraK&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=c99c62,e0ac69,f5d0b5&backgroundColor=ffd5dc,ffdfbf,c0aede,b6e3f4,d1d4f9"
    ],
    topScore:      8450,
    yourScore:     5120,
    yourRank:      4,
    isJoined:      false,
    rating:        4.2,                // NEW: 1-5 star rating
    ratingCount:   128,                // NEW: number of players who rated
  }
];

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return timeLeft;
}

function TimerDisplay({ timeLeft, accent }: { timeLeft: string; accent: string }) {
  const parts = timeLeft.split(/[: ]/).filter(Boolean);
  
  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <div className="absolute inset-0 opacity-10 blur-sm" style={{ color: accent }} />
        <div className="relative flex items-center gap-0.5 backdrop-blur-md rounded-lg px-2.5 py-1.5">
          {parts.map((part, i) => (
            <span key={i} className="flex items-center">
              <span className="text-[19px] font-black tabular-nums" style={{ color: accent }}>
                {part}
              </span>
              {i < parts.length - 1 && (
                <span className="text-[16px] font-bold mx-0.5" style={{ color: accent, opacity: 0.5 }}>:</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  const timeLeft = useCountdown('2026-06-13T12:00:00Z');

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | Octagames - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-2 dark: xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          {/* <div className="flex items-center mt-5 justify-between mb-5">
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">Challenges</h1>
              <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
            </div>
            <button onClick={() => setOpenInfo(true)} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10  border-gray-200 dark:border-white/10">
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
          </div> */}

          <SpinAndWin />

          <div className="mb-4">
            <h1 className="text-[18px] font-bold text-gray-900 dark:text-white">Exclusive Challenge</h1>
            <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
          </div>

          <NeubrutalistCard
            mainColor=""
            shadowColor="#7C3AED"
            pressable
            shadowOffsetX={5}
            shadowOffsetY={5}
            borderRadius={10}
          >
            <SpecialTournamentCard tournaments={tournament} />          
          </NeubrutalistCard>

          {/* <StepsList steps={[
            { emoji: "🎯", step: 1, title: "Pick a Challenge",   desc: "Browse active challenges" },
            { emoji: "🪙", step: 2, title: "Enter Your Stake",    desc: "Decide how many" },
            { emoji: "🎮", step: 3, title: "Hit the Target",      desc: "Play the game" },
            { emoji: "🏆", step: 4, title: "Win Rewards",         desc: "Meet the target" },
          ]} /> */}

          <div className="mb-4 mt-10 flex justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-gray-900 dark:text-white">Daily Challenge</h1>
              <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
            </div>
            <div className="flex items-center">
                <span className="text-[10px] font-semibold text-black">
                  Opens in: 
                </span>
              <TimerDisplay timeLeft={timeLeft} accent={'#000'} />
            </div>
          </div>

          <ChallengeList
            challenges={challengeCardList}
            onClick={(challenge) => {
              setChallenge(challenge);
              setOpen(true);
            }}
          />

         <BottomSheet title="" isOpen={openInfo} onClose={() => setOpenInfo(false)} background="">
            <SpinWheel />   
          </BottomSheet>

          <BottomSheet title="Challenge Detail" isOpen={open} onClose={() => setOpen(false)}>
            {detailData && (
              <ChallengeDetail data={detailData} />
            )}     
          </BottomSheet>

          {/* <BottomSheet title="" isOpen={openInfo} onClose={() => setOpenInfo(false)}>
            <ChallengeInfo />   
          </BottomSheet> */}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
// import DashboardWallet from "../../components/cards/DashboardWalletCard";
import { TournamentCarousel } from "../../components/tournament/TournamentCarousel";
import gameImg from "../../images/towermaster.png";
import gameImg2 from "../../images/subway.jpeg";
import numberOne from "../../images/number-1.png"
import numberTwo from "../../images/number-2.png"
import numberThree from "../../images/number-3.png"

// import OctaCoinGrid from "../../components/game/OctacoinGrid";
import { GameGrid } from "../../components/game/GameGrid";
import QuickActions from "../../components/game/QuickAction";
import WinnersMarquee from "../../components/carousel/RecentWinners";
import TopPlayers from "../../components/game/TopPlayer";
import GameCanvas from "../../components/game/GameCanvas";
import WinModal from "../../components/game/WinModal";

// import InAppMessageContainer from "../Friends/InAppMsg";
// import InfoBottomSheet from "../../components/ui/bottom-sheet/InfoSheet";

import CardDeckCarousel from "../../components/carousel/CardCarousel";
import NeubrutalistCard from "../../components/ui/cards/NeuCard";
import SpecialTournamentCard from "../../components/tournament/SpecialTournament";
import StreakAndMissions from "../../components/gamifications/DailyStreakMission";
// import ActivityTicker from "../../components/tournament/Ticker";
// import NotificationCard from "../../components/ui/bottom-sheet/PushNotification";

export default function Home() {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [open, setOpen] = useState(false);
  // const [infoOpen, setInfoOpen] = useState(true);

  const games = [
    {
      id: "1",
      title: "Grab The Sushi",
      image: gameImg,
      provider: "Pragmatic Play",
      plays: 236000,
    },
    {
      id: "2",
      title: "Samurai Rampage",
      image: gameImg2,
      provider: "Pragmatic Play",
      plays: 109000,
    },
    {
      id: "3",
      title: "Dart Master",
      image: gameImg,
      provider: "Pragmatic Play",
      plays: 300000,
    },
  ];

  const tournaments = [
{
  id:           "1",
  title:        "8 Ball Pool",
  image:        gameImg2,           // keep your existing import
  publisher:    "Octagames Studio",
  tag:          "Live",
  prize:        "₦3,000",           // per-winner prize
  prizePool:    "₦5000",          // total prize pool shown as hero number
  playersCount: 16,
  maxPlayers:   50,
  minCoins:     202,
  maxCoins:     675,
  endTime:      "2026-06-12T12:00:00Z",
  difficulty:   "medium" as const,
  playerAvatars: [
    "https://api.dicebear.com/9.x/big-smile/svg?seed=AmakaO&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    "https://api.dicebear.com/9.x/big-smile/svg?seed=KwameD&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=8c5a2b,a47539,c99c62,e0ac69&backgroundColor=ffdfbf,ffd5dc,c0aede,b6e3f4",
    "https://api.dicebear.com/9.x/big-smile/svg?seed=FatimaT&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=a47539,c99c62,e0ac69,f5d0b5&backgroundColor=d1d4f9,c0aede,ffd5dc,ffdfbf",
    "https://api.dicebear.com/9.x/big-smile/svg?seed=SiphoM&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539&backgroundColor=b6e3f4,d1d4f9,c0aede,ffdfbf",
    "https://api.dicebear.com/9.x/big-smile/svg?seed=ZaraK&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=c99c62,e0ac69,f5d0b5&backgroundColor=ffd5dc,ffdfbf,c0aede,b6e3f4,d1d4f9"
  ],  
  topScore:     8450,
  yourScore:    5120,
  yourRank:     4,
  isJoined:     false,
},
{
  id:           "1",
  title:        "Tower Master",
  image:        gameImg,           // keep your existing import
  publisher:    "Octagames Studio",
  tag:          "Live",
  prize:        "₦3,000",           // per-winner prize
  prizePool:    "₦50,000",          // total prize pool shown as hero number
  playersCount: 16,
  maxPlayers:   50,
  minCoins:     202,
  maxCoins:     675,
  endTime:      "2026-06-12T12:00:00Z",
  difficulty:   "medium" as const,
  playerAvatars:[],                 // fill with avatar URLs when available
  topScore:     8450,
  yourScore:    5120,
  yourRank:     4,
  isJoined:     true,
}
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

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | Octagames - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="pt-13 grid grid-cols-12 gap-2 mb-2 md:gap-6">

        <div className="col-span-12 px-2 xl:col-span-7">
          {/* <InAppMessageContainer /> */}
          <WinnersMarquee />

          <StreakAndMissions />

          <div className="mb-4 mt-5">
            <h1 className="text-[18px] font-bold text-gray-900 dark:text-white">Jackpot Tournament</h1>
            <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
          </div>

          <NeubrutalistCard
            mainColor="#7C3AED"
            shadowColor="#7C3AED"
            pressable
            shadowOffsetX={5}
            shadowOffsetY={5}
            borderRadius={10}
          >
            <SpecialTournamentCard tournaments={tournament} />          
          </NeubrutalistCard>

          <CardDeckCarousel autoPlay interval={5000} />

          <TopPlayers
            players={[
              {
                id: "1",
                username: "veesbaby 💗",
                avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=zo3twbi2&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
                rank: 1,
                rankImage: numberOne,
              },
              {
                id: "2",
                username: "opueh ✋🏽",
                avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=opueh&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
                rank: 2,
                rankImage: numberTwo,
              },
              {
                id: "3",
                username: "@franky 🏐",
                avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=franky&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
                rank: 3,
                rankImage: numberThree,
              },
              {
                id: "4",
                username: "@Daisy",
                avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=daisy&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
                rank: 3,
                rankImage: numberThree,
              },
            ]}
          />

          {/* <UserStreak streak={6} nextMilestone={7} /> */}

          {/* <OctaCoinGrid limit={3} /> */}

          <div>
            <QuickActions />
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold text-black dark:text-gray-400 mb-3">
              Popular Games
            </h4>

            <GameGrid 
              games={games}
              onGameClick={() => {
              setIsGameOpen(true);
              }}
            />            
          </div>

          <div className="mt-8">
            <h4 className="text-[17px] mb-3 font-bold text-gray-900 dark:text-white">
              Live Tournaments
            </h4>

            <TournamentCarousel
              tournaments={tournaments}
              onPlay={(t) => console.log("Play", t)}
            />

            <h4 className="mt-6 w-100 mb-2 font-bold text-gray-800 text-md dark:text-white/90">
              Creator Tournament
            </h4>

            <TournamentCarousel
              tournaments={tournaments}
              onPlay={(t) => console.log("Play", t)}
            />

            <GameCanvas
              isOpen={isGameOpen}
              onClose={() => setIsGameOpen(false)}
              gameUrl="https://your-game-url.com"
              gameTitle="Flappy Battle"
              wager={100}
              sessionId="abc123"
            />

            <WinModal
              isOpen={open}
              amount={800}
              streak={1}
              percentageBetter={84}
              onClose={() => setOpen(false)}
            />

            {/* <InfoBottomSheet
              isOpen={infoOpen}
              onClose={() => setInfoOpen(false)}
              title="New Update Available 🎉"
              description="We’ve added new features and improved performance. Update now to enjoy the latest experience."
              image="https://via.placeholder.com/150"
            /> */}
          </div>          
        </div>
      </div>
    </>
  );
}

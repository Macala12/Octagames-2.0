import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import DashboardWallet from "../../components/cards/DashboardWalletCard";
import { TournamentCarousel } from "../../components/tournament/TournamentCarousel";
import gameImg from "../../images/towermaster.png";
import gameImg2 from "../../images/subway.jpeg";
import numberOne from "../../images/number-1.png"
import numberTwo from "../../images/number-2.png"
import numberThree from "../../images/number-3.png"

import OctaCoinGrid from "../../components/game/OctacoinGrid";
import { GameGrid } from "../../components/game/GameGrid";
import QuickActions from "../../components/game/QuickAction";
import WinnersMarquee from "../../components/carousel/RecentWinners";
import TopPlayers from "../../components/game/TopPlayer";
import GameCanvas from "../../components/game/GameCanvas";

export default function Home() {
  const [isGameOpen, setIsGameOpen] = useState(false);
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

  const tournaments = [
    {
      id: "1",
      title: "8ball pool",
      image: gameImg2,
      prize: "N3000",
      playersCount: 16,
      minCoins: 202,
      maxCoins: 675,
      endTime: "2026-04-01T12:00:00Z",
    },
    {
      id: "2",
      title: "Runner Clash",
      image: gameImg,
      prize: "N3000",
      playersCount: 24,
      minCoins: 100,
      maxCoins: 500,
      endTime: "2026-04-01T15:00:00Z",
    },
  ];

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | Octagames - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-2 mb-2 md:gap-6">

        <div className="col-span-12 space-y-6 px-2 xl:col-span-7">
          <WinnersMarquee />
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
            ]}
          />
          <DashboardWallet />

          {/* <UserStreak streak={6} nextMilestone={7} /> */}

          <OctaCoinGrid limit={3} />

          <div>
            <QuickActions />
          </div>

          <div className="block">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              Top Games
            </h4>

            <GameGrid 
              games={games}
              onGameClick={() => {
              setIsGameOpen(true);
              }}
            />            
          </div>

          <div>
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
          </div>          
        </div>
      </div>
    </>
  );
}

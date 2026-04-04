import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

{/* Navigations */}
import Home from "./pages/Dashboard/Home";
import Friends from "./pages/Friends/FriendChat";
import Wallet from "./pages/Wallet/Wallet";
import TransactionHistory from "./pages/Wallet/TransactionHistory";
import Withdraw from "./pages/Wallet/Withdraw";
import Challenges from "./pages/Challenges/Challenges";
import Octacoin from "./pages/Octacoin/Octacoins";

import TournamentScreen from "./pages/Tournament/Tournament";
import Notification from "./pages/Notifications";

import ReferralScreen from "./pages/Referral";

/* Profile page - Edit */
import EditProfilePage from "./pages/EditProfile";
import EditSecurityPage from "./pages/EditSecurity";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/wallet" element={<Wallet balance={3700500} transactions={[]}  />} />
            <Route path="/transaction" element={<TransactionHistory balance={0} transactions={[]} />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/octacoin" element={<Octacoin />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/referral" element={<ReferralScreen />} />

            <Route path="/tournament" element={<TournamentScreen data={{
              "id": "game_001",
              "gameTitle": "Tower Master",
              "gameImage": "http://localhost:5700/Assets/_games/_img/sushiroll.png",
              "minPot": 5000,
              "maxPot": 20000,
              "endTime": "2026-02-03T01:22:52Z",
              "playerCount": 12,
              "maxPlayers": 20,
              "joinCost": 100,
              "leaderboard": [
                {
                  "rank": 1,
                  "username": "AceGamer",
                  "score": 980,
                  "reward": 100
                },
                {
                  "rank": 2,
                  "username": "ProX",
                  "score": 870,
                  "reward": 100
                },
                {
                  "rank": 3,
                  "username": "AceGamer",
                  "score": 980,
                  "reward": 100
                },
                {
                  "rank": 4,
                  "username": "ProX",
                  "score": 870,
                  "reward": 100
                },
                {
                  "rank": 5,
                  "username": "AceGamer",
                  "score": 980,
                  "reward": 100
                },
                {
                  "rank": 6,
                  "username": "ProX",
                  "score": 870,
                  "reward": 100
                }
              ]
            }} players={[]} />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Edit */}
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/edit-security" element={<EditSecurityPage />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

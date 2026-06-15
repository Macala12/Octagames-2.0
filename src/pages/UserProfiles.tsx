import UserMetaCard from "../components/UserProfile/UserMetaCard";
import Settings from "../components/UserProfile/Settings";
import PageMeta from "../components/common/PageMeta";
import ReferralCard from "../components/cards/ReferralCard";
// import UserInfoCard from "../components/UserProfile/UserInfoCard";
import AchievementGallery from "../components/UserProfile/AchievementGallery";
import RecentBattles from "../components/UserProfile/FriendsBattleHistory";
export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | Octagames - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="dark: lg:p-6">
        <div className="">
          <div className="flex items-cente justify-between">
            {/* <div>
              <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">Profile</h1>
              <p className="text-xs text-gray-400 mt-0.5">Play challenges and win instant cash</p>
            </div> */}
            {/* <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10">
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
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
              </svg>
            </button> */}
          </div>
          <UserMetaCard />
          <RecentBattles />
          <AchievementGallery />
          <ReferralCard />
          <Settings />
        </div>
      </div>
    </>
  );
}

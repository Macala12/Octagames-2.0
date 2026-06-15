import { Wallet, Coins } from "lucide-react";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserHeader from "../components/header/UserHeader";

const AppHeader: React.FC = () => {
  return (
    <header className="absolute top-0 z-[999] w-full">
      <div className="flex items-center justify-between px-3 py-2.5 max-w-[1400px] mx-auto gap-3">

        {/* LEFT: BRAND */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
            <span className="text-[#FFD60A] font-black text-[13px]">O</span>
          </div>
          <span className="text-[16px] font-black tracking-tight text-zinc-900 hidden xs:block">
            Octa<span className="text-[#FFD60A]">Games</span>
          </span>
        </div>

        {/* RIGHT: PILLS + NOTIF + USER */}
        <div className="flex items-center gap-1.5 min-w-0">

          {/* Wallet Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:border-zinc-300 cursor-pointer group transition-colors shrink-0">
            <Wallet size={13} className="text-emerald-600 shrink-0" />
            <div className="flex flex-col leading-none gap-[2px]">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide hidden sm:block">
                Wallet
              </span>
              <span className="text-[12px] font-black text-zinc-900 tabular-nums whitespace-nowrap">
                ₦24,500
              </span>
            </div>
          </div>

          {/* OctaCoin Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:border-zinc-300 cursor-pointer group transition-colors shrink-0">
            <Coins size={13} className="text-amber-600 shrink-0" />
            <div className="flex flex-col leading-none gap-[2px]">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide hidden sm:block">
                OctaCoin
              </span>
              <span className="text-[12px] font-black text-amber-700 tabular-nums whitespace-nowrap">
                1,250
              </span>
            </div>
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User */}
          <UserHeader />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
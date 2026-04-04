import { useState } from "react";
const getTitle = () => {
  if (location.pathname.startsWith("/challenges")) return "Challenges";
  if (location.pathname.startsWith("/wallet")) return "Wallet";
  if (location.pathname.startsWith("/friends")) return "Friends";
  if (location.pathname.startsWith("/profile")) return "Profile";
  return "Home";
};
export default function UserHeader() {
  return (
    <div className="relative">
      <button className="flex items-center dropdown-toggle">
        <span className="mr-2 overflow-hidden rounded-full h-11 w-11">
          <img src="https://api.dicebear.com/9.x/big-smile/svg?seed=zo3twbi2&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf" alt="User" />
        </span>

        <div>
          <span className="block mr-1 font-semibold text-theme-sm text-left">@datboifrom_imo</span>
          <span className="block mr-1 font-semibold text-[12px] text-gray-400">Let's have some fun 💰 🎉 </span>
        </div>
      </button>
    </div>
  );
}

import { useEffect, useRef } from "react";

import NotificationDropdown from "../components/header/NotificationDropdown";
import UserHeader from "../components/header/UserHeader";

const AppHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘ + K shortcut (keep for desktop search later)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-[999] w-full bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">

        {/* 🔥 LEFT: PAGE TITLE (MOBILE APP STYLE) */}
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          {/* {getTitle()} */}
          <UserHeader />
        </div>

        {/* 🔥 RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* 🔔 NOTIFICATIONS */}
          <NotificationDropdown />
        </div>
      </div>

      {/* 🔍 DESKTOP SEARCH (OPTIONAL KEEP) */}
      <div className="hidden lg:block px-6 pb-3">
        <div className="relative max-w-md">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
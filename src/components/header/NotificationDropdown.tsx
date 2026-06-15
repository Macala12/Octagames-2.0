import { useState, useEffect } from "react";
import { NotificationDrawer } from "../ui/drawer/NotificationDrawer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  avatar: string;
  name: string;
  message: string;
  category: string;
  time: string;
  read: boolean;
  online: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", avatar: "/images/user/user-02.jpg", name: "Terry Franci",    message: "just beat your score in 8 Ball Pool 🎱",          category: "Game",       time: "2m ago",  read: false, online: true  },
  { id: "2", avatar: "/images/user/user-03.jpg", name: "Alena Franci",    message: "challenged you to a Tower Master duel ⚔️",         category: "Challenge",  time: "8m ago",  read: false, online: true  },
  { id: "3", avatar: "/images/user/user-04.jpg", name: "Jocelyn Kenter",  message: "sent you ₦2,000 from their wallet 💸",              category: "Payment",    time: "15m ago", read: false, online: false },
  { id: "4", avatar: "/images/user/user-05.jpg", name: "Brandon Philips", message: "Your tournament prize of ₦5,000 was paid out 🏆",  category: "Payout",     time: "1h ago",  read: true,  online: false },
  { id: "5", avatar: "/images/user/user-02.jpg", name: "OctaGames",       message: "New FIFA 25 tournament starts in 30 minutes!",     category: "Tournament", time: "2h ago",  read: true,  online: true  },
  { id: "6", avatar: "/images/user/user-03.jpg", name: "Alena Franci",    message: "liked your leaderboard highlight 🔥",              category: "Social",     time: "3h ago",  read: true,  online: true  },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Game:       { bg: "rgba(124,58,237,0.12)",  text: "#7C3AED" },
  Challenge:  { bg: "rgba(239,68,68,0.10)",   text: "#dc2626" },
  Payment:    { bg: "rgba(34,197,94,0.10)",   text: "#16a34a" },
  Payout:     { bg: "rgba(255,214,10,0.15)",  text: "#92740a" },
  Tournament: { bg: "rgba(249,115,22,0.10)",  text: "#ea580c" },
  Social:     { bg: "rgba(14,165,233,0.10)",  text: "#0284c7" },
};

export default function NotificationDropdown() {
  const [open, setOpen]     = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread              = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead    = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Bell button — light-mode styles */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:border-zinc-300 transition-colors"
      >
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 z-10 min-w-[17px] h-[17px] px-[3px] rounded-full bg-[#FFD60A] border-2 border-white flex items-center justify-center">
            <span className="text-[9px] font-black text-zinc-900">{unread}</span>
          </span>
        )}
        <svg className="w-[17px] h-[17px] text-zinc-700" viewBox="0 0 20 20" fill="none">
          <path
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Drawer */}
      <NotificationDrawer
        open={open}
        notifications={notifs}
        unreadCount={unread}
        onClose={() => setOpen(false)}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </>
  );
}
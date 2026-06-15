import { useEffect, useRef } from "react";

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Game:       { bg: "rgba(124,58,237,0.12)",  text: "#7C3AED" },
  Challenge:  { bg: "rgba(239,68,68,0.10)",   text: "#dc2626" },
  Payment:    { bg: "rgba(34,197,94,0.10)",   text: "#16a34a" },
  Payout:     { bg: "rgba(255,214,10,0.15)",  text: "#92740a" },
  Tournament: { bg: "rgba(249,115,22,0.10)",  text: "#ea580c" },
  Social:     { bg: "rgba(14,165,233,0.10)",  text: "#0284c7" },
};

interface NotificationDrawerProps {
  open: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationDrawer({
  open,
  notifications,
  unreadCount,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: NotificationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes slideIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOut { from { transform: translateX(0); }   to { transform: translateX(100%); } }
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        .drawer-enter { animation: slideIn 0.28s cubic-bezier(0.32,0.72,0,1) both; }
        .drawer-bg    { animation: fadeIn  0.28s ease both; }
      `}</style>

      {/* Backdrop */}
      {open && (
        <div
          className="drawer-bg fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[1001] h-full w-full max-w-[400px] flex flex-col
          bg-white dark:bg-[#0f0f1a]
          border-l border-gray-100 dark:border-white/[0.07]
          shadow-2xl
          transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.07] shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-black"
                style={{ background: "#FFD60A", color: "#111" }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-bold text-[#7C3AED] hover:underline transition-all"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-500 dark:text-white/50">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Notification list ── */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 pb-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gray-300 dark:text-white/20">
                  <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400 dark:text-white/30">All caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {notifications.map((n) => {
                const cat = CATEGORY_COLORS[n.category] ?? { bg: "rgba(0,0,0,0.06)", text: "#555" };
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="w-full text-left flex items-start gap-3.5 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors relative"
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                      )}

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={n.avatar}
                          alt={n.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          style={{
                            opacity: n.read ? 0.7 : 1,
                            outline: n.read ? "none" : "2px solid #7C3AED",
                            outlineOffset: 2,
                          }}
                        />
                        {/* Online dot */}
                        <span
                          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0f0f1a]"
                          style={{ background: n.online ? "#22c55e" : "#9ca3af" }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p
                            className="text-[13px] leading-none"
                            style={{ fontWeight: n.read ? 500 : 700, color: n.read ? "#6b7280" : "#111" }}
                          >
                            <span className="dark:text-white dark:opacity-90">{n.name}</span>
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-white/30 shrink-0 mt-0.5 font-medium">
                            {n.time}
                          </span>
                        </div>

                        <p
                          className="text-[12px] leading-relaxed mb-2"
                          style={{ color: n.read ? "#9ca3af" : "#374151" }}
                        >
                          <span className="dark:text-white/50">{n.message}</span>
                        </p>

                        {/* Category pill */}
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: cat.bg, color: cat.text }}
                        >
                          {n.category}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.07] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-[13px] font-bold transition-colors"
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
}
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { ChevronDownIcon } from "../icons";

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#99a1af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const ChallengeIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#99a1af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h12v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z" />
    <path d="M6 4H4v2a4 4 0 0 0 2.5 3.7M18 4h2v2a4 4 0 0 1-2.5 3.7" />
    <path d="M12 12v4" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
  </svg>
);

const WithdrawIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#99a1af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
    <circle cx="12" cy="15" r="1.5" fill={active ? "#7C3AED" : "#99a1af"} stroke="none" />
  </svg>
);

const FriendsIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#99a1af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="7" r="2.5" />
    <path d="M21 20c0-2.8-2-5-4.5-5.5" />
  </svg>
);

const ProfileIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#7C3AED" : "#99a1af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ─── Nav config ───────────────────────────────────────────────────────────────
type NavItem = {
  name: string;
  icon: (active: boolean) => React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { name: "Home",      icon: (a) => <HomeIcon active={a} />,      path: "/home"       },
  { name: "Challenge", icon: (a) => <ChallengeIcon active={a} />, path: "/challenges" },
  { name: "Withdraw",  icon: (a) => <WithdrawIcon active={a} />,  path: "/wallet"     },
  { name: "Friends",   icon: (a) => <FriendsIcon active={a} />,   path: "/friends"    },
  { name: "Profile",   icon: (a) => <ProfileIcon active={a} />,   path: "/profile"    },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const active = !!(nav.path && isActive(nav.path));
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                style={{
                  background: openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "rgba(124,58,237,0.1)" : "transparent",
                }}
              >
                <span>{nav.icon(openSubmenu?.type === menuType && openSubmenu?.index === index)}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="flex-1 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">
                    {nav.name}
                  </span>
                )}
                <ChevronDownIcon />
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
                  style={{
                    background: active ? "rgba(124,58,237,0.1)" : "transparent",
                  }}
                >
                  {/* Active left bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                      style={{ background: "#7C3AED" }}
                    />
                  )}
                  <span>{nav.icon(active)}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span
                      className="text-sm font-semibold transition-colors"
                      style={{ color: active ? "#7C3AED" : "#6b7280" }}
                    >
                      {nav.name}
                    </span>
                  )}
                </Link>
              )
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <style>{`
        .mobile-tab-active-dot {
          width: 4px; height: 4px; border-radius: 9999px;
          background: #7C3AED; margin-top: 4px;
        }
      `}</style>

      <aside
        className={`
          fixed z-50 dark:bg-[#0a0a0a]
          bottom-3 left-0 w-full h-[68px]
          flex flex-row items-center justify-around
          dark:border-white/[0.06]
          lg:top-0 lg:left-0 lg:h-screen lg:border-r lg:border-t-0
          lg:flex-col lg:justify-start
          lg:transition-all lg:duration-300
          ${isExpanded || isMobileOpen ? "lg:w-[280px]" : isHovered ? "lg:w-[280px]" : "lg:w-[80px]"}
        `}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="shadow-sm bg-white py-2 px-3 bg-black w-100 rounded-[30px]">

        {/* LOGO — desktop only */}
        <div className="py-7 hidden lg:flex justify-center shrink-0">
          <Link to="/">
            {(isExpanded || isHovered) ? (
              <span className="text-[18px] font-black tracking-tight text-gray-900 dark:text-white">
                Octa<span style={{ color: "#7C3AED" }}>Games</span>
              </span>
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#7C3AED" }}
              >
                <span className="text-white font-black text-[15px]">O</span>
              </div>
            )}
          </Link>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden lg:block w-full px-4 mb-5 shrink-0">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:block w-full px-3 flex-1 overflow-y-auto">
          {(isExpanded || isHovered || isMobileOpen) && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 px-3 mb-3">
              Menu
            </p>
          )}
          {renderMenuItems(navItems, "main")}
        </nav>

        {/* WIDGET — desktop only */}
        <div className="hidden lg:block mt-auto w-full shrink-0">
          {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
        </div>

        {/* MOBILE BOTTOM BAR */}
        <div className="flex lg:hidden items-center justify-around w-full h-full px-2">
          {navItems.map((nav) => {
            const active = !!(nav.path && isActive(nav.path));
            return (
              nav.path && (
                <Link
                  key={nav.name}
                  to={nav.path}
                  className="flex flex-col items-center justify-center flex-1 py-1 gap-0.5"
                >
                  {/* Icon container with active bg pill */}
                  <div
                    className="flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200"
                    style={{ background: active ? "rgba(124,58,237,0.12)" : "transparent" }}
                  >
                    {nav.icon(active)}
                  </div>

                  <span
                    className="text-[10px] font-bold transition-colors"
                    style={{ color: active ? "#7C3AED" : "#9ca3af" }}
                  >
                    {nav.name}
                  </span>

                  {/* Active dot */}
                  {/* {active && <span className="mobile-tab-active-dot" />} */}
                </Link>
              )
            );
          })}
        </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
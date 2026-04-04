import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  GridIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Challenge,
  Friends,
  Withdraw
} from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 🔥 MAIN NAV (used for both desktop + mobile)
const navItems: NavItem[] = [
  { name: "Home", icon: <GridIcon />, path: "/home" },
  { name: "Challenge", icon: <Challenge style={{ fill: "#99a1af" }} />, path: "/challenges" },
  { name: "Withdraw", icon: <Withdraw style={{ fill: "#99a1af" }} />, path: "/wallet" },
  { name: "Friends", icon: <Friends style={{ fill: "#99a1af" }} />, path: "/friends" },
  { name: "Profile", icon: <UserCircleIcon />, path: "/profile" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } =
    useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path ||
      location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    console.log(subMenuHeight);
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
    setOpenSubmenu((prev) => {
      if (
        prev &&
        prev.type === menuType &&
        prev.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item ${
                openSubmenu?.type === menuType &&
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              }`}
            >
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span>{nav.name}</span>
              )}
              <ChevronDownIcon />
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item ${
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`
        fixed z-50 bg-white dark:bg-black

        /* MOBILE (DEFAULT) */
        bottom-0 left-0 w-full h-[70px]
        flex flex-row items-center justify-around border-t

        /* DESKTOP */
        lg:top-0 lg:left-0 lg:h-screen lg:border-r lg:border-t-0
        lg:flex-col lg:justify-start
        lg:transition-all lg:duration-300
        ${
          isExpanded || isMobileOpen
            ? "lg:w-[290px]"
            : isHovered
            ? "lg:w-[290px]"
            : "lg:w-[90px]"
        }
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO (DESKTOP ONLY) */}
      <div className="py-8 hidden lg:flex justify-center">
        <Link to="/">
          <img src="/images/logo/logo.svg" alt="Logo" width={120} />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="w-full">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block px-4">
          <h2 className="mb-4 text-xs uppercase text-gray-400">
            Menu
          </h2>
          {renderMenuItems(navItems, "main")}
        </div>

        {/* MOBILE BOTTOM BAR */}
        <div className="flex lg:hidden items-center justify-around w-full">
          {navItems.map((nav) => {
            const active = nav.path && isActive(nav.path);

            return (
              nav.path && (
                <Link
                  key={nav.name}
                  to={nav.path}
                  className="flex flex-col items-center justify-center flex-1"
                >
                  <span
                    className={`text-xl ${
                      active
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {nav.icon}
                  </span>

                  <span
                    className={`text-[11px] mt-1 ${
                      active
                        ? "text-brand-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {nav.name}
                  </span>
                </Link>
              )
            );
          })}
        </div>
      </nav>

      {/* WIDGET (DESKTOP ONLY) */}
      <div className="hidden lg:block mt-auto">
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
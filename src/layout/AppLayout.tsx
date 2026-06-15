import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useLocation } from "react-router";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith("/challenges")) return "Challenges";
    if (location.pathname.startsWith("/wallet")) return "Wallet";
    if (location.pathname.startsWith("/friends")) return "Friends";
    if (location.pathname.startsWith("/profile")) return "Profile";
    if (location.pathname.startsWith("/home")) return "Home";
    return "none";
  };

  const title = getTitle();
  const hasPadding = title !== "none";

  return (
    <div className="min-h-screen xl:flex">
      <div>
        {title !== "none" && <AppSidebar />}
        <Backdrop />
      </div>

      <div
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
          ${isMobileOpen ? "ml-0" : ""}
          ${hasPadding ? "pb-[80px] lg:pb-0" : ""}
        `}
      >
        {title === "Home" && <AppHeader />}

        <div
          className={`
            ${hasPadding ? "" : ""}
            mx-auto max-w-(--breakpoint-2xl) md:p-6
          `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;

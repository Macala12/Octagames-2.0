import { useState } from "react";
import { useNavigate } from "react-router";
import Switch from "../form/switch/Switch";
import BottomSheet from "../ui/bottom-sheet/BottomSheet";
import HowItWorksContent from "../ui/bottom-sheet/HowitWorks";
import { ContactUsContent } from "../ui/bottom-sheet/ContactUs";

const ACCENT = "#09f2a6";

interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    className="text-gray-300 dark:text-white/20">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const SettingsRow = ({ icon, iconBg, label, right, onClick, danger }: SettingsRowProps) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left
      hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/8
      transition-colors">
    <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg }}>
      {icon}
    </div>
    <span className={`flex-1 text-sm font-medium ${danger
      ? "text-red-500"
      : "text-gray-800 dark:text-white/90"}`}>
      {label}
    </span>
    {right ?? <ChevronRight />}
  </button>
);

const Divider = () => (
  <div className="h-px bg-gray-100 dark:bg-white/8 mx-4" />
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[18px] overflow-hidden mb-3">
    {children}
  </div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2 mt-4">
    {label}
  </p>
);

export default function Settings() {
  const navigate = useNavigate();
  const [open_htw, setOpenHTW] = useState(false);
  const [open_cu, setOpenCU] = useState(false);

  return (
    <div className="pb-10 max-w-md mx-auto">

      {/* Preferences */}
      <SectionLabel label="Preferences" />
      <SectionCard>
        <SettingsRow
          iconBg="rgba(9,242,166,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09f2a6" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
          label="Notifications"
          right={<Switch label="" />}
        />
        <Divider />
        <SettingsRow
          iconBg="rgba(99,102,241,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>}
          label="In-app Sounds"
          right={<Switch label="" />}
        />
      </SectionCard>

      {/* Account */}
      <SectionLabel label="Account" />
      <SectionCard>
        <SettingsRow iconBg="rgba(251,191,36,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          label="Edit Profile" onClick={() => navigate("/edit-profile")} />
        <Divider />
        <SettingsRow iconBg="rgba(56,189,248,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          label="Change Password" onClick={() => navigate("/edit-security")} />
        <Divider />
        <SettingsRow iconBg="rgba(167,139,250,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
          label="Privacy" onClick={() => navigate("/settings/privacy")} />
      </SectionCard>

      {/* General */}
      <SectionLabel label="General" />
      <SectionCard>
        <SettingsRow iconBg="rgba(9,242,166,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09f2a6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>}
          label="About Us" onClick={() => navigate("/about")} />
        <Divider />
        <SettingsRow iconBg="rgba(251,191,36,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>}
          label="How it Works" onClick={() => setOpenHTW(true)} />
        <Divider />
        <SettingsRow iconBg="rgba(56,189,248,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 5.51 5.51l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>}
          label="Contact Us" onClick={() => setOpenCU(true)} />
      </SectionCard>

      {/* Logout */}
      <SectionCard>
        <SettingsRow iconBg="rgba(239,68,68,0.1)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
          label="Logout" danger right={null}
          onClick={() => console.log("Logout")} />
      </SectionCard>

      {/* Version */}
      <p className="text-center text-[11px] text-gray-300 dark:text-white/20 mt-4">
        Octaplay v1.0.0
      </p>

      <BottomSheet isOpen={open_htw} onClose={() => setOpenHTW(false)}>
        <HowItWorksContent />
      </BottomSheet>

      <BottomSheet isOpen={open_cu} onClose={() => setOpenCU(false)}>
        <ContactUsContent />
      </BottomSheet>
    </div>
  );
}
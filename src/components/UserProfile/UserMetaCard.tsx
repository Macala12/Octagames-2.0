import { Camera, Settings, MapPin, User, Gamepad2, Trophy, X, Users } from "lucide-react";

const ACCENT = "#7C3AED";

const stats = [
  {
    label: "Played",
    value: 32,
    icon: Gamepad2,
    iconColor: "rgba(0,0,0,0.45)",
    iconBg: "rgba(0,0,0,0.04)",
    valueColor: "#0a0a0a",
  },
  {
    label: "Wins",
    value: 24,
    icon: Trophy,
    iconColor: ACCENT,
    iconBg: `${ACCENT}14`,
    valueColor: ACCENT,
  },
  {
    label: "Losses",
    value: 8,
    icon: X,
    iconColor: "#EF4444",
    iconBg: "rgba(239,68,68,0.10)",
    valueColor: "#0a0a0a",
  },
  {
    label: "Friends",
    value: 10,
    icon: Users,
    iconColor: "#0EA5E9",
    iconBg: "rgba(14,165,233,0.10)",
    valueColor: "#0a0a0a",
  },
];

/* ------------------ AVATAR STACK ------------------ */
function AvatarStack({
  avatarSrc,
  profileSrc,
  size = 92,
}: {
  avatarSrc: string;
  profileSrc: string;
  size?: number;
}) {
  const badgeSize = Math.round(size * 0.42);

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* Game / chosen avatar — main */}
      <img
        src={avatarSrc}
        alt="Avatar"
        className="rounded-full object-cover"
        style={{ width: size, height: size, border: `3px solid ${ACCENT}33` }}
      />

      {/* Real profile photo — badge */}
      <img
        src={profileSrc}
        alt="Profile"
        className="absolute rounded-full object-cover"
        style={{
          width: badgeSize,
          height: badgeSize,
          bottom: -4,
          left: -4,
          border: "3px solid #fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        }}
      />

      {/* Edit button */}
      <button
        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
        style={{ background: ACCENT, border: "2px solid #fff" }}
      >
        <Camera size={13} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  );
}


export default function UserMetaCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      {/* Top row: avatar stack + settings */}
      <div className="px-5 pt-5 flex items-start justify-between">
        <AvatarStack
          avatarSrc="https://api.dicebear.com/9.x/big-smile/svg?seed=zo3twbi2&radius=50&backgroundType=gradientLinear&randomizeIds=true&skinColor=643d19,8c5a2b,a47539,c99c62&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
          profileSrc="https://i.pravatar.cc/150?img=12"
          size={92}
        />

        <button
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "rgba(0,0,0,0.04)" }}
        >
          <Settings size={16} color="rgba(0,0,0,0.45)" strokeWidth={2.25} />
        </button>
      </div>

      {/* Name + meta */}
      <div className="px-5 pb-5 pt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[17px] font-extrabold text-gray-900">
            @datboifrom_imo
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
            style={{ background: ACCENT }}
          >
            Lvl 14
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <User size={11} strokeWidth={2.25} className="text-gray-400" />
          <span className="text-[12px] text-gray-500">Michael Alaoma</span>
          <span className="w-px h-2.5 bg-gray-200 inline-block" />
          <MapPin size={11} strokeWidth={2.25} className="text-gray-400" />
          <span className="text-[12px] text-gray-500">Lagos, Nigeria</span>
        </div>

        {/* XP bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              XP Progress
            </span>
            <span className="text-[10px] font-bold text-gray-900">1,200 / 2,000</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "60%", background: ACCENT }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => {
            // const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2"
                style={{ background: "rgba(0,0,0,0.02)" }}
              >
                {/* <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                >
                  <Icon size={15} color={s.iconColor} strokeWidth={2.25} />
                </div> */}
                <span className="text-[16px] font-extrabold leading-none" style={{ color: s.valueColor }}>
                  {s.value}
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wide text-gray-400">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
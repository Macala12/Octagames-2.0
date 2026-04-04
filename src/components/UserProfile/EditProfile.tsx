import React, { useState, useRef } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar?: string;
}

interface Props {
  initialData?: Partial<ProfileData>;
  onSave?: (data: ProfileData) => void;
  onCancel?: () => void;
  onBack?: () => void;
}

const ACCENT      = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

const DEFAULT: ProfileData = {
  firstName: "Michael",
  lastName:  "Alaoma",
  username:  "datboifrom_imo",
  email:     "michael@example.com",
  phone:     "+234 812 345 6789",
  location:  "Lagos, Nigeria",
  bio:       "Competitive gamer. Always chasing the top spot 🎮🔥",
};

// Reusable field wrapper
function Field({ label, icon, children }: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
            {icon}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Input style helper
function inputCls(hasIcon = false) {
  return [
    "w-full h-[52px] rounded-2xl border-[1.5px] border-gray-200 dark:border-white/8",
    "bg-gray-50 dark:bg-white/5 text-[15px] text-gray-900 dark:text-white",
    "outline-none font-inherit transition-all",
    "placeholder:text-gray-300 dark:placeholder:text-white/20",
    "focus:border-[#09f2a6] focus:shadow-[0_0_0_4px_rgba(9,242,166,0.08)]",
    hasIcon ? "pl-10 pr-4" : "px-4",
  ].join(" ");
}

export default function EditProfile({ initialData, onSave, onCancel, onBack }: Props) {
  const [form, setForm]       = useState<ProfileData>({ ...DEFAULT, ...initialData });
  const [changed, setChanged] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialData?.avatar);
  const fileRef               = useRef<HTMLInputElement>(null);

  const set = (key: keyof ProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setChanged(true);
    };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setChanged(true);
  };

  const handleSave = () => {
    onSave?.(form);
    setChanged(false);
  };

  const IconEmail = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  const IconPhone = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 5.51 5.51l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
    </svg>
  );
  const IconPin = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );

  return (
    <div className=" dark:rounded-3xl overflow-hidden max-w-[480px] h-[100%] mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-0 mb-9">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10
            active:scale-90 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className="text-gray-500 dark:text-white/50">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[18px] font-extrabold text-gray-900 dark:text-white">Edit Profile</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Keep your details up to date</p>
        </div>
        {/* Unsaved changes dot */}
        {changed && (
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 px-5 pb-6">
        <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
          <div className="w-[88px] h-[88px] rounded-full">
            <img
              src={preview ?? `https://api.dicebear.com/9.x/big-smile/svg?seed=${form.username}&radius=50&backgroundColor=b6e3f4`}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]"
            style={{ background: ACCENT }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={ACCENT_TEXT} strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div className="text-center">
          <p className="text-[15px] font-bold text-gray-900 dark:text-white">@{form.username}</p>
          <button onClick={() => fileRef.current?.click()}
            className="text-[12px] font-semibold mt-1"
            style={{ color: ACCENT }}>
            Change photo
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 py-5 flex flex-col gap-4">

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name">
            <input className={inputCls()} type="text" value={form.firstName} onChange={set("firstName")} placeholder="First name" />
          </Field>
          <Field label="Last Name">
            <input className={inputCls()} type="text" value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
          </Field>
        </div>

        {/* Username */}
        <Field label="Username" icon={<span className="text-[15px] font-semibold text-gray-400">@</span>}>
          <input className={inputCls(true)} type="text" value={form.username} onChange={set("username")} placeholder="username" />
        </Field>

        {/* Email */}
        <Field label="Email Address" icon={<IconEmail />}>
          <input className={inputCls(true)} type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" />
        </Field>

        {/* Phone */}
        <Field label="Phone" icon={<IconPhone />}>
          <input className={inputCls(true)} type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" />
        </Field>

        {/* Location */}
        <Field label="Location" icon={<IconPin />}>
          <input className={inputCls(true)} type="text" value={form.location} onChange={set("location")} placeholder="City, Country" />
        </Field>

        {/* Bio */}
        <Field label="Bio">
          <textarea
            value={form.bio}
            onChange={set("bio")}
            placeholder="Tell the world a little about yourself..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/8
              bg-gray-50 dark:bg-white/5 text-[15px] text-gray-900 dark:text-white
              outline-none resize-none leading-relaxed transition-all
              placeholder:text-gray-300 dark:placeholder:text-white/20
              focus:border-[#09f2a6] focus:shadow-[0_0_0_4px_rgba(9,242,166,0.08)]"
          />
        </Field>

        <div className="h-px bg-gray-100 dark:bg-white/8" />

        {/* Actions */}
        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/10
              bg-transparent text-[14px] font-semibold text-gray-500 dark:text-white/50
              hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.97] transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!changed}
            className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: ACCENT, color: ACCENT_TEXT }}>
            Save Changes
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-300 dark:text-white/20">
          Your info is private and only used to personalise your experience.
        </p>

      </div>
    </div>
  );
}
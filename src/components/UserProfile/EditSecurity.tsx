// ─── EditSecurity.tsx ────────────────────────────────────────────────────────
import React, { useState } from "react";

interface Props {
  onBack?: () => void;
  onCancel?: () => void;
  onSave?: (currentPassword: string, newPassword: string) => void;
}

const ACCENT      = "#09f2a6";
const ACCENT_TEXT = "#022b1e";

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  pct: number;
}

function checkStrength(pwd: string): StrengthResult {
  const rules = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ];
  const score = rules.filter(Boolean).length;
  const map = [
    { label: "—",      color: "var(--color-text-tertiary)", pct: 0   },
    { label: "Weak",   color: "#EF4444",                    pct: 25  },
    { label: "Fair",   color: "#FBBF24",                    pct: 50  },
    { label: "Good",   color: "#FBBF24",                    pct: 75  },
    { label: "Strong", color: ACCENT,                       pct: 100 },
  ];
  return { score, ...map[score] };
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function PasswordField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[52px] pl-4 pr-12 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/8
            bg-gray-50 dark:bg-white/5 text-[15px] text-gray-900 dark:text-white tracking-widest
            outline-none transition-all placeholder:tracking-normal placeholder:text-gray-300 dark:placeholder:text-white/20
            focus:border-[#09f2a6] focus:shadow-[0_0_0_4px_rgba(9,242,166,0.08)]"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 p-1">
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

function RuleItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] transition-colors"
      style={{ color: ok ? ACCENT : "var(--color-text-tertiary)" }}>
      {ok ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )}
      {label}
    </div>
  );
}

export function EditSecurity({ onBack, onCancel, onSave }: Props) {
  const [current, setCurrent]   = useState("");
  const [newPwd,  setNewPwd]    = useState("");
  const [confirm, setConfirm]   = useState("");

  const strength   = checkStrength(newPwd);
  const mismatch   = confirm.length > 0 && newPwd !== confirm;
  const canSave    = current.length > 0 && strength.score >= 2 && newPwd === confirm && newPwd.length > 0;

  const rules = [
    { ok: newPwd.length >= 8,           label: "8+ characters" },
    { ok: /[A-Z]/.test(newPwd),         label: "Uppercase"     },
    { ok: /[0-9]/.test(newPwd),         label: "Number"        },
    { ok: /[^A-Za-z0-9]/.test(newPwd), label: "Special char"  },
  ];

  return (
    <div className="h-[100%] dark:rounded-3xl overflow-hidden max-w-[480px] mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-6">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 active:scale-90 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className="text-gray-500 dark:text-white/50">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[18px] font-extrabold text-gray-900 dark:text-white">Change Password</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Keep your account secure</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(9,242,166,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-4">
        <PasswordField label="Current Password" value={current}
          onChange={setCurrent} placeholder="Enter current password" />

        {/* New password + strength */}
        <div>
          <PasswordField label="New Password" value={newPwd}
            onChange={setNewPwd} placeholder="Enter new password" />
          {newPwd.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Password strength</span>
                <span className="text-[11px] font-bold" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${strength.pct}%`, background: strength.color }} />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
                {rules.map(r => <RuleItem key={r.label} ok={r.ok} label={r.label} />)}
              </div>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div>
          <PasswordField label="Confirm New Password" value={confirm}
            onChange={setConfirm} placeholder="Repeat new password" />
          {mismatch && (
            <p className="text-[12px] text-red-400 mt-1.5">Passwords do not match</p>
          )}
        </div>

        <div className="h-px bg-gray-100 dark:bg-white/8" />

        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl border-[1.5px] border-gray-200 dark:border-white/10
              text-[14px] font-semibold text-gray-500 dark:text-white/50 bg-transparent
              hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.97] transition-all">
            Cancel
          </button>
          <button onClick={() => canSave && onSave?.(current, newPwd)}
            disabled={!canSave}
            className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: ACCENT, color: ACCENT_TEXT }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
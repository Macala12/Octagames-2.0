// ─── ContactUsContent.tsx ─────────────────────────────────────────────────────
import React from "react";

interface Social {
  name: string;
  url: string;
  bg: string;
  border: string;
  iconColor: string;
  icon: React.ReactNode;
}

const ACCENT = "#09f2a6";

const socials: Social[] = [
  {
    name: "Facebook", url: "https://facebook.com",
    bg: "rgba(59,89,152,0.1)", border: "rgba(59,89,152,0.2)", iconColor: "#3B5998",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B5998" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
  {
    name: "X (Twitter)", url: "https://x.com",
    bg: "rgba(0,0,0,0.05)", border: "rgba(0,0,0,0.1)", iconColor: "currentColor",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4l16 16M20 4 4 20"/></svg>,
  },
  {
    name: "Instagram", url: "https://instagram.com",
    bg: "rgba(225,48,108,0.08)", border: "rgba(225,48,108,0.15)", iconColor: "#E1306C",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/></svg>,
  },
  {
    name: "WhatsApp", url: "https://wa.me/",
    bg: "rgba(37,211,102,0.08)", border: "rgba(37,211,102,0.15)", iconColor: "#25D366",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  },
];

export function ContactUsContent() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-white">Contact Us</h2>
        <p className="text-[13px] text-gray-400 mt-1 leading-relaxed">
          Need help or have questions? Reach out to us on any of our platforms below.
        </p>
      </div>

      {/* Email CTA — primary */}
      <a href="mailto:support@octaplay.com"
        className="flex items-center gap-3 p-4 rounded-2xl no-underline active:scale-[0.97] transition-transform"
        style={{ background: "rgba(9,242,166,0.06)", border: `1px solid rgba(9,242,166,0.2)` }}>
        <div className="w-11 h-11 rounded-[13px] flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(9,242,166,0.12)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-gray-900 dark:text-white">Email Support</p>
          <p className="text-[12px] font-semibold" style={{ color: ACCENT }}>support@octaplay.com</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="text-gray-300 dark:text-white/20 flex-shrink-0">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>

      {/* Social grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {socials.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-[18px] no-underline
              bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8
              hover:-translate-y-px active:scale-[0.97] transition-all">
            <div className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              {s.icon}
            </div>
            <span className="text-[13px] font-bold text-gray-900 dark:text-white">{s.name}</span>
            <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-gray-200 dark:text-white/20">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
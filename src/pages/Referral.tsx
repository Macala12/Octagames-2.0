import React, { useState, useCallback } from "react";

interface Referral {
  id: string;
  username: string;
  dateJoined: string;
  status: "success" | "pending";
  avatarInitial?: string;
  avatarColor?: string;
}

interface Props {
  referralCode?: string;
  referralLink?: string;
  referrals?: Referral[];
  onBack?: () => void;
}

const AVATAR_COLORS = ["#7C3AED","#0369A1","#15803D","#B45309","#9D174D","#1D4ED8","#065F46"];
const REWARD_PER_REF = 300;
const ACCENT = "#7C3AED";
const ACCENT_TEXT = "#ffffff";

const SURFACE = "rgba(0,0,0,0.025)";
const SURFACE_BORDER = "rgba(0,0,0,0.07)";
const TEXT_MUTED = "rgba(0,0,0,0.45)";
const TEXT_FAINT = "rgba(0,0,0,0.28)";
const TEXT_PRIMARY = "#0a0a0a";

type Filter = "all" | "success" | "pending";

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2.5 text-[13px] font-bold"
      style={{ background: ACCENT, color: ACCENT_TEXT }}>
      {msg}
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex-1 rounded-xl py-2.5 px-3"
      style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
      <p className="text-[16px] font-extrabold leading-none" style={{ color: color ?? TEXT_PRIMARY }}>{value}</p>
      <p className="text-[10.5px] font-semibold mt-1" style={{ color: TEXT_MUTED }}>
        {label}
      </p>
    </div>
  );
}

function ReferralRow({ ref: r }: { ref: Referral }) {
  const initial = r.avatarInitial ?? r.username.replace("@","").charAt(0).toUpperCase();
  const color   = r.avatarColor ?? AVATAR_COLORS[0];
  const joined  = r.status === "success";

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
        style={{ background: color }}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold truncate" style={{ color: TEXT_PRIMARY }}>{r.username}</p>
        <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>{r.dateJoined}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
          style={{
            background: joined ? "rgba(9,201,138,0.10)" : "rgba(0,0,0,0.05)",
            color: joined ? "#0a8f64" : TEXT_MUTED,
          }}>
          {joined ? "Joined" : "Pending"}
        </span>
        {joined && (
          <span className="text-[12px] font-bold" style={{ color: "#0a8f64" }}>
            +₦{REWARD_PER_REF}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ReferralScreen({
  referralCode = "OCTA123",
  referralLink = "https://octagames.app/ref/OCTA123",
  referrals = [],
  onBack,
}: Props) {
  const [filter, setFilter]   = useState<Filter>("all");
  const [toast, setToast]     = useState("");
  const [copied, setCopied]   = useState(false);

  const totalEarned  = referrals.filter(r => r.status === "success").length * REWARD_PER_REF;
  const totalPending = referrals.filter(r => r.status === "pending").length;

  const filtered = filter === "all" ? referrals : referrals.filter(r => r.status === filter);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }, []);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(referralCode); } catch {}
    showToast("Code copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(referralLink); } catch {}
    showToast("Link copied!");
  };

  const shareWhatsApp = () => {
    const msg = `🔥 Join me on Octagames and win real rewards!\n\nUse my referral code: ${referralCode}\n\nPlay here: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Join Octagames", text: `Use my code ${referralCode}`, url: referralLink });
    } else {
      copyLink();
    }
  };

  const tabStyle = (t: Filter) => ({
    flex: 1, padding: "8px 0", borderRadius: 99, border: "none",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    background: filter === t ? "#7C3AED" : "transparent",
    color:      filter === t ? "#ffffff" : TEXT_MUTED,
    transition: "all 0.2s",
  } as React.CSSProperties);

  return (
    <div className="min-h-screen p-4" style={{ background: "#ffffff", color: TEXT_PRIMARY }}>
      {toast && <Toast msg={toast} />}

      <div className="max-w-[420px] mx-auto pb-6">
        

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
              active:scale-90 transition-transform"
            style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(0,0,0,0.55)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-extrabold" style={{ color: TEXT_PRIMARY }}>Referrals</h1>
            <p className="text-[12px] mt-0.5" style={{ color: TEXT_MUTED }}>
              Invite friends and earn rewards together
            </p>
          </div>
        </div>

        {/* Hero card */}
         <div className="relative rounded-3xl p-6 overflow-hidden mb-4" style={{ background: "#0a0a0a" }}>
           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 350 180" preserveAspectRatio="xMidYMid slice">
             <defs>
               <radialGradient id="hg" cx="80%" cy="30%" r="60%">
                 <stop offset="0%" stopColor="#09f2a6" stopOpacity="0.1"/>
                 <stop offset="100%" stopColor="#09f2a6" stopOpacity="0"/>
               </radialGradient>
             </defs>
             <rect width="350" height="180" fill="url(#hg)"/>
             <circle cx="290" cy="30" r="60" fill="#09f2a6" opacity="0.04"/>
             <circle cx="290" cy="30" r="35" fill="#09f2a6" opacity="0.06"/>
          </svg>

          <div className="absolute right-5 top-5 text-[44px] select-none"
            style={{ animation: "floatCoin 3s ease-in-out infinite", filter: "drop-shadow(0 0 12px rgba(251,191,36,0.4))" }}>
            🪙
          </div>

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.8px] mb-2.5"
              style={{ color: "rgba(255,255,255,0.35)" }}>Earn with every invite</p>
            <h1 className="text-[26px] font-extrabold text-white leading-tight mb-2">
              Get <span style={{ color: ACCENT }}>₦{REWARD_PER_REF.toLocaleString()}</span><br />
              per friend you refer
            </h1>
            <p className="text-[13px] leading-relaxed max-w-[200px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Invite friends, they join & play — you both win real rewards.
            </p>
          </div>
        </div>

        {/* Earnings hero */}
        <div className="relative rounded-2xl p-5 mb-3 overflow-hidden">
          <p className="text-[11px] font-bold uppercase tracking-[0.6px] mb-1.5">
            Total earned
          </p>
          <p className="text-[34px] font-extrabold leading-none mb-4" style={{ color: TEXT_PRIMARY }}>
            ₦{totalEarned.toLocaleString()}<span className="text-gray-400">.00</span>
          </p>

          <div className="flex items-center justify-between rounded-xl px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span className="text-[15px] font-bold tracking-[2px]" style={{ color: TEXT_PRIMARY }}>{referralCode}</span>
            </div>
            <button onClick={copyCode}
              className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold active:scale-90 transition-transform"
              style={{ background: copied ? ACCENT : "#7c3aed2b", color: copied ? "#ffffff" : "#7C3AED" }}>
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-5">
          <StatChip label="Friends referred" value={String(referrals.length)} />
          <StatChip label="Pending" value={String(totalPending)} color="#B45309" />
        </div>

        {/* Link */}
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: TEXT_MUTED }}>
            Referral link
          </p>
          <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-2"
            style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
            <p className="text-[12px] truncate flex-1" style={{ color: TEXT_MUTED }}>
              {referralLink}
            </p>
            <button onClick={copyLink} className="flex-shrink-0 active:scale-90 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Share */}
        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.6px] mb-2.5" style={{ color: TEXT_MUTED }}>
            Share via
          </p>
          <button onClick={shareWhatsApp}
            className="w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 mb-2.5 active:scale-[0.97] transition-transform"
            style={{ background: ACCENT, color: "#fff" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Share on WhatsApp
          </button>
          <div className="flex gap-2">
            <button onClick={copyLink}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
              style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}`, color: TEXT_PRIMARY }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy link
            </button>
            <button onClick={nativeShare}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
              style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}`, color: TEXT_PRIMARY }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              More options
            </button>
          </div>
        </div>

        {/* Referral history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-extrabold" style={{ color: TEXT_PRIMARY }}>Referral history</p>
            <p className="text-[12px] font-semibold" style={{ color: TEXT_MUTED }}>
              {referrals.length} friend{referrals.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-full p-1 mb-4 gap-1" style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
            {(["all","success","pending"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={tabStyle(f)}>
                {f === "all" ? "All" : f === "success" ? "Joined" : "Pending"}
              </button>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 rounded-2xl" style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.04)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={TEXT_MUTED} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p className="text-[14px] font-bold mb-1" style={{ color: TEXT_MUTED }}>
                No referrals yet
              </p>
              <p className="text-[12px]" style={{ color: TEXT_FAINT }}>
                Share your code to start earning
              </p>
            </div>
          ) : (
            <div className="rounded-2xl px-4" style={{ background: SURFACE, border: `1px solid ${SURFACE_BORDER}` }}>
              {filtered.map(r => <ReferralRow key={r.id} ref={r} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
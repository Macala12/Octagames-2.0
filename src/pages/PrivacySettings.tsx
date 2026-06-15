// ─── 1. PrivacySettings.tsx ───────────────────────────────────────────────────
"use client"
import { useState } from "react"

type Visibility = "everyone" | "friends" | "noone"
interface BlockedUser { id: string; username: string }

const ACCENT = "#09f2a6", AT = "#022b1e"

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2 mt-5">{label}</p>
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[18px] overflow-hidden">{children}</div>
}

function RowDivider() { return <div className="h-px bg-gray-100 dark:bg-white/8 mx-4" /> }

function SelectRow({ label, value, onChange }: { label: string; value: Visibility; onChange: (v: Visibility) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[14px] font-medium text-gray-900 dark:text-white flex-1">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value as Visibility)}
        className="bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 dark:text-white outline-none cursor-pointer">
        <option value="everyone">Everyone</option>
        <option value="friends">Friends only</option>
        <option value="noone">Nobody</option>
      </select>
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex-1">
        <p className="text-[14px] font-medium text-gray-900 dark:text-white">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div onClick={() => onChange(!value)} className="w-[44px] h-[26px] rounded-full relative cursor-pointer transition-colors flex-shrink-0"
        style={{ background: value ? ACCENT : "var(--color-border-secondary)" }}>
        <div className="absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all"
          style={{ left: value ? 21 : 3 }} />
      </div>
    </div>
  )
}

export default function PrivacySettings() {
  const [profileVis,    setProfileVis]    = useState<Visibility>("everyone")
  const [statsVis,      setStatsVis]      = useState<Visibility>("friends")
  const [whoMessage,    setWhoMessage]    = useState<Visibility>("everyone")
  const [whoChallenge,  setWhoChallenge]  = useState<Visibility>("everyone")
  const [whoFriendReq,  setWhoFriendReq]  = useState<Visibility>("everyone")
  const [showOnline,    setShowOnline]    = useState(true)
  const [readReceipts,  setReadReceipts]  = useState(true)
  const [activityStatus,setActivityStatus]= useState(false)
  const [blockedUsers,  setBlockedUsers]  = useState<BlockedUser[]>([
    { id: "1", username: "toxic_player 😤" },
    { id: "2", username: "spam_guy 🚫" },
  ])

  return (
    <div className="px-4 pt-5 pb-10 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 active:scale-90 transition-transform">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-500 dark:text-white/50"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Privacy Settings</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Control who sees and contacts you</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(9,242,166,0.1)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
      </div>

      {/* Visibility */}
      <SectionLabel label="Visibility" />
      <SectionCard>
        <SelectRow label="Who can see my profile?" value={profileVis} onChange={setProfileVis} />
        <RowDivider />
        <SelectRow label="Who can see my stats?" value={statsVis} onChange={setStatsVis} />
      </SectionCard>

      {/* Interactions */}
      <SectionLabel label="Interactions" />
      <SectionCard>
        <SelectRow label="Who can message me?"          value={whoMessage}   onChange={setWhoMessage}   /><RowDivider />
        <SelectRow label="Who can challenge me?"        value={whoChallenge} onChange={setWhoChallenge} /><RowDivider />
        <SelectRow label="Who can send friend requests?" value={whoFriendReq} onChange={setWhoFriendReq} />
      </SectionCard>

      {/* Account */}
      <SectionLabel label="Account" />
      <SectionCard>
        <ToggleRow label="Appear online"       sub="Let others see when you're active" value={showOnline}     onChange={setShowOnline}     /><RowDivider />
        <ToggleRow label="Read receipts"       sub="Show when you've read messages"    value={readReceipts}   onChange={setReadReceipts}   /><RowDivider />
        <ToggleRow label="Show activity status" sub="Display your gaming activity"     value={activityStatus} onChange={setActivityStatus} />
      </SectionCard>

      {/* Blocked users */}
      <SectionLabel label="Blocked Users" />
      <SectionCard>
        {blockedUsers.length === 0 ? (
          <p className="px-4 py-4 text-[13px] text-gray-400">No blocked users</p>
        ) : (
          blockedUsers.map((u, i) => (
            <div key={u.id}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold text-red-400 flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-[14px] font-medium text-gray-900 dark:text-white truncate">{u.username}</span>
                <button onClick={() => setBlockedUsers(b => b.filter(x => x.id !== u.id))}
                  className="text-[11px] font-bold rounded-full px-3 py-1.5"
                  style={{ background: "rgba(9,242,166,0.1)", color: ACCENT, border: `0.5px solid rgba(9,242,166,0.2)` }}>
                  Unblock
                </button>
              </div>
              {i < blockedUsers.length - 1 && <RowDivider />}
            </div>
          ))
        )}
      </SectionCard>

      {/* Danger zone */}
      <SectionLabel label="Danger Zone" />
      <SectionCard>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.1)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </div>
          <span className="flex-1 text-[14px] font-semibold text-red-400">Delete Account</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 dark:text-white/20"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </SectionCard>
    </div>
  )
}
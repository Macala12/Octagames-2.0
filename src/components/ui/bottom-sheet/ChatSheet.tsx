// ─── 4. ChatSettings.tsx ─────────────────────────────────────────────────────
import { useState } from "react"
const ACCENT = "#09f2a6"
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} className="w-[44px] h-[26px] rounded-full relative cursor-pointer flex-shrink-0 transition-colors"
      style={{ background: value ? ACCENT : "var(--color-border-secondary)" }}>
      <div className="absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all" style={{ left: value ? 21 : 3 }} />
    </div>
  )
}
function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-[18px] overflow-hidden">{children}</div>
}
function Divider() { return <div className="h-px bg-gray-100 dark:bg-white/8 mx-4" /> }
function Label({ text }: { text: string }) {
  return <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2 mt-5">{text}</p>
}

export default function ChatSettings() {
  const [mute,           setMute]           = useState(false)
  const [allowChallenge, setAllowChallenge] = useState(true)
  const [autoRematch,    setAutoRematch]    = useState(false)
  const [defaultWager,   setDefaultWager]   = useState(100)
  const [notifications,  setNotifications]  = useState(true)
  const [whoMessage,     setWhoMessage]     = useState("everyone")

  return (
    <div className="px-4 pt-5 pb-10 max-w-md mx-auto">
      <div className="mb-5">
        <h1 className="text-[17px] font-extrabold text-gray-900 dark:text-white">Chat Settings</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Manage this conversation</p>
      </div>

      <Label text="Chat Controls" />
      <SectionCard>
        {[
          { label: "Mute Notifications",       sub: "No alerts from this chat",   val: mute,          set: setMute },
          { label: "Enable Challenge Requests", sub: "Allow game invites",         val: allowChallenge,set: setAllowChallenge },
          { label: "Auto-Accept Rematch",       sub: "Instantly start rematches",  val: autoRematch,   set: setAutoRematch },
        ].map(({ label, sub, val, set }, i, arr) => (
          <div key={label}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-[14px] font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
              </div>
              <Toggle value={val} onChange={set} />
            </div>
            {i < arr.length - 1 && <Divider />}
          </div>
        ))}
      </SectionCard>

      <Label text="Game Settings" />
      <SectionCard>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-white">Default Wager</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Pre-filled when you send a challenge</p>
          </div>
          <input type="number" value={defaultWager} onChange={e => setDefaultWager(Number(e.target.value))}
            className="w-20 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-[13px] font-semibold text-gray-900 dark:text-white outline-none text-right focus:border-[#09f2a6] transition-colors" />
        </div>
      </SectionCard>

      <Label text="Notifications" />
      <SectionCard>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-white">Enable Notifications</p>
          </div>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>
      </SectionCard>

      <Label text="Privacy" />
      <SectionCard>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex-1 text-[14px] font-medium text-gray-900 dark:text-white">Who can message you?</span>
          <select value={whoMessage} onChange={e => setWhoMessage(e.target.value)}
            className="bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 dark:text-white outline-none cursor-pointer">
            <option value="everyone">Everyone</option>
            <option value="friends">Friends only</option>
            <option value="noone">Nobody</option>
          </select>
        </div>
      </SectionCard>

      <Label text="Actions" />
      <SectionCard>
        {[
          { label: "Block User",   color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
          { label: "Report User",  color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
          { label: "Clear Chat",   color: "var(--color-text-secondary)", bg: "var(--color-background-secondary)" },
        ].map(({ label, color }, i, arr) => (
          <div key={label}>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <span className="flex-1 text-[14px] font-semibold" style={{ color }}>{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 dark:text-white/20"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            {i < arr.length - 1 && <Divider />}
          </div>
        ))}
      </SectionCard>

      <button className="w-full mt-3 py-4 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "0.5px solid rgba(239,68,68,0.25)" }}>
        Leave Chat
      </button>
    </div>
  )
}
// ─── 2. TransactionSuccess.tsx ────────────────────────────────────────────────
const ACCENT = "#09f2a6", AT = "#022b1e"

interface Props {
  amount: number; recipient: string; type: string
  network: string; reference: string
  onClose?: () => void; onDownload?: () => void
}

function ConfettiRain() {
  return (
    <>
      {Array.from({ length: 24 }, (_, i) => {
        const cols = [ACCENT,"#FBBF24","#fff","#A78BFA","#38BDF8"]
        return (
          <div key={i} style={{
            position: "absolute", top: -8, left: `${2 + (i * 4) % 96}%`,
            width: 4 + (i % 4), height: 4 + (i % 4),
            background: cols[i % cols.length],
            borderRadius: i % 2 === 0 ? "50%" : 2,
            animation: `wmConfetti ${1.8 + (i % 3) * 0.4}s ease forwards`,
            animationDelay: `${(i * 0.04) % 0.8}s`, opacity: 0.85,
            pointerEvents: "none",
          }} />
        )
      })}
    </>
  )
}

export default function TransactionSuccess({ amount, recipient, type, network, reference, onClose, onDownload }: Props) {
  const rows = [
    { label: "Amount",         value: `₦${amount.toFixed(2)}`, accent: true },
    { label: "Recipient",      value: recipient },
    { label: "Channel",        value: type },
    { label: "Octacoins",      value: network },
    { label: "Reference",      value: reference.length > 18 ? reference.slice(0, 18) + "…" : reference },
  ]

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--color-background-tertiary)" }}>

      {/* Hero */}
      <div className="relative flex flex-col items-center pt-8 pb-10 px-4 overflow-hidden">
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}><ConfettiRain /></div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(9,242,166,0.1) 0%, transparent 60%)" }} />

        <button onClick={onClose}
          className="absolute left-4 top-6 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 active:scale-90 transition-transform">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-500 dark:text-white/50"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <p className="relative text-[20px] font-extrabold text-gray-900 dark:text-white mt-12 mb-6">Purchase Successful!</p>

        <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(9,242,166,0.12)", border: "1.5px solid rgba(9,242,166,0.25)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: ACCENT }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={AT} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>

      {/* Receipt */}
      <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-t-3xl px-5 pt-5 pb-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-extrabold text-gray-900 dark:text-white">Payment Details</p>
          <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8 mb-5">
          {rows.map(({ label, value, accent }, i) => (
            <div key={label}
              className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 dark:border-white/8 last:border-0"
              style={{ background: i % 2 === 1 ? "var(--color-background-secondary)" : "var(--color-background-primary)" }}>
              <span className="text-[13px] text-gray-400">{label}</span>
              <span className="text-[14px] font-bold" style={{ color: accent ? ACCENT : "var(--color-text-primary)", fontSize: accent ? 16 : 14 }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button onClick={onDownload}
            className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
            style={{ background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Receipt
          </button>
          <button onClick={onClose}
            className="flex-[2] py-3.5 rounded-2xl text-[14px] font-extrabold active:scale-[0.97] transition-transform"
            style={{ background: ACCENT, color: AT, border: "none" }}>
            Done 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
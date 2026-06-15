// ─── 6. InfoBottomSheet.tsx ───────────────────────────────────────────────────
import { AnimatePresence, motion } from "framer-motion"
const ACCENT = "#09f2a6", AT = "#022b1e"

interface Props {
  isOpen: boolean; onClose: () => void
  title: string; description: string; image?: string
  onDontShowAgain?: () => void
}

export default function InfoBottomSheet({ isOpen, onClose, title, description, image, onDontShowAgain }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
            style={{ background: "#0a0a0a", borderRadius: "24px 24px 0 0" }}>

            <div style={{ width: 36, height: 4, borderRadius: 99, background: "var(--color-border-secondary)", margin: "12px auto 20px" }} />

            <div className="px-5 pb-10 text-center">
              {image ? (
                <img src={image} alt="info" className="w-28 h-28 object-contain mx-auto mb-4 rounded-2xl" />
              ) : (
                <div className="w-20 h-20 rounded-[22px] mx-auto mb-4 flex items-center justify-center text-[44px]"
                  style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
                  🎯
                </div>
              )}

              <h2 className="text-[19px] font-extrabold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6 max-w-xs mx-auto">{description}</p>

              <button onClick={onClose}
                className="w-full py-4 rounded-2xl text-[14px] font-extrabold mb-3 active:scale-[0.97] transition-transform"
                style={{ background: ACCENT, color: AT, border: "none" }}>
                Got it, let's play! 🎮
              </button>

              <button onClick={() => { onDontShowAgain?.(); onClose(); }}
                className="text-[12px] underline underline-offset-2 cursor-pointer bg-transparent border-none"
                style={{ color: "var(--color-text-tertiary)" }}>
                Don't show again
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
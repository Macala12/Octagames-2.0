// ─── 7. InAppMessage.tsx ──────────────────────────────────────────────────────
import { motion } from "framer-motion"
import React from "react";

interface Message { id: string; name: string; text: string; avatar?: string; initials?: string; color?: string }
interface Props { message: Message; onClick?: () => void }

const ACCENT = "#09f2a6"

export function InAppMessage({ message, onClick }: Props) {
  const [imgErr, setImgErr] = React.useState(false)

  return (
    <motion.div layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-4 rounded-[18px] cursor-pointer active:scale-[0.97] transition-transform relative overflow-hidden"
      style={{
        background: "#1a1a1a",
        border: "0.5px solid var(--color-border-tertiary)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {message.avatar && !imgErr ? (
          <img src={message.avatar} onError={() => setImgErr(true)}
            alt={message.name} className="w-11 h-11 rounded-full object-cover block"
            style={{ border: `2px solid rgba(9,242,166,0.3)` }} />
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-extrabold text-white"
            style={{ background: message.color ?? "#7C3AED" }}>
            {message.initials ?? message.name.charAt(0)}
          </div>
        )}
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0a0a0a]"
          style={{ background: ACCENT }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{message.name}</p>
        <p className="text-[12px] text-gray-400 truncate">{message.text}</p>
      </div>

      <p className="text-[10px] flex-shrink-0" style={{ color: "var(--color-text-tertiary)" }}>now</p>
    </motion.div>
  )
}
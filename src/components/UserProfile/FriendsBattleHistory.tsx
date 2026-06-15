"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Trophy, Swords, Star, Skull } from "lucide-react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet";

const ACCENT  = "#7C3AED";
const ACCENT2 = "#6D28D9"; // shadow depth
const WIN_CLR  = "#6D28D9";
const LOSS_CLR = "#EF4444";
const DRAW_CLR = "#9CA3AF";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface FriendRef {
  id: string;
  name: string;
  avatar: string;
  status?: "online" | "offline" | "playing";
}

interface BattleRecord {
  id: string;
  friend: FriendRef;
  game: { name: string; emoji: string; color: string };
  result: "win" | "loss" | "draw";
  wager: number;
  date: string;
  rematchAvailable?: boolean;
}

/* ─── Mock data ──────────────────────────────────────────────────────────── */
const CURRENT_USER = { name: "You", avatar: "https://i.pravatar.cc/150?img=12" };

const FRIENDS_POOL: FriendRef[] = [
  { id:"1", name:"Michael", avatar:"https://i.pravatar.cc/150?img=3",  status:"playing" },
  { id:"2", name:"Chisom",  avatar:"https://i.pravatar.cc/150?img=5",  status:"online"  },
  { id:"3", name:"Vera",    avatar:"https://i.pravatar.cc/150?img=9",  status:"offline" },
  { id:"4", name:"David",   avatar:"https://i.pravatar.cc/150?img=15", status:"online"  },
];

const GAME_OPTIONS = [
  { name:"Subway Run",  emoji:"🏃", color:"#FFE4E1" },
  { name:"Speed Ball",  emoji:"🏀", color:"#E0F2FE" },
  { name:"Stack Rush",  emoji:"🧱", color:"#FEF3C7" },
  { name:"Puzzle Pop",  emoji:"🧩", color:"#EDE9FE" },
];

const BATTLE_HISTORY: BattleRecord[] = [
  { id:"1", friend:FRIENDS_POOL[0], game:GAME_OPTIONS[0], result:"win",  wager:500,  date:"2h ago"     },
  { id:"2", friend:FRIENDS_POOL[1], game:GAME_OPTIONS[2], result:"loss", wager:0,    date:"5h ago",     rematchAvailable:true },
  { id:"3", friend:FRIENDS_POOL[2], game:GAME_OPTIONS[1], result:"win",  wager:1000, date:"Yesterday"  },
  { id:"4", friend:FRIENDS_POOL[0], game:GAME_OPTIONS[3], result:"draw", wager:200,  date:"Yesterday"  },
  { id:"5", friend:FRIENDS_POOL[3], game:GAME_OPTIONS[0], result:"loss", wager:300,  date:"2 days ago" },
];

/* ─── Rivalry stats (with draws fixed) ──────────────────────────────────── */
function getRivalryStats(friendId: string) {
  const records = BATTLE_HISTORY.filter(r => r.friend.id === friendId);
  return {
    wins:   records.filter(r => r.result === "win").length,
    losses: records.filter(r => r.result === "loss").length,
    draws:  records.filter(r => r.result === "draw").length,
    total:  records.length,
    records,
  };
}

/* ─── Status dot ─────────────────────────────────────────────────────────── */
// function StatusDot({ status, size = 14 }: { status?: string; size?: number }) {
//   const color = status === "online" ? "#22C55E" : status === "playing" ? ACCENT : "#D1D5DB";
//   return (
//     <span style={{
//       width: size, height: size, borderRadius: "50%",
//       background: color, border: "2.5px solid #fff",
//       display: "block",
//       boxShadow: status === "playing" ? `0 0 0 2px ${ACCENT}44` : "none",
//     }} />
//   );
// }

/* ─── Battle Card ────────────────────────────────────────────────────────── */
function BattleCard({
  record, onClick, onRematch,
}: {
  record: BattleRecord;
  onClick?: () => void;
  onRematch?: (e: React.MouseEvent) => void;
}) {
  const isWin  = record.result === "win";
  const isLoss = record.result === "loss";

  const border = isWin ? WIN_CLR : isLoss ? LOSS_CLR : DRAW_CLR;
  // const bg     = isWin ? "#F0FDF4" : isLoss ? "#FEF2F2" : "#F9FAFB";
  // const shadow = isWin
  //   ? `0 5px 0 ${WIN_CLR}, 0 8px 20px rgba(22,163,74,0.12)`
  //   : isLoss
  //   ? `0 5px 0 ${LOSS_CLR}, 0 8px 20px rgba(239,68,68,0.12)`
  //   : `0 5px 0 #D1D5DB, 0 8px 16px rgba(0,0,0,0.06)`;

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{
        minWidth: 300,
        background: "#fff",
        borderRadius: 10,
        padding: "14px 16px",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner result badge */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 38, height: 38,
        background: border,
        borderRadius: "0 17px 0 14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "3px solid #fff",
      }}>
        {isWin  && <Trophy size={16} color="#fff" fill="#fff" />}
        {isLoss && <Skull  size={16} color="#fff" />}
        {!isWin && !isLoss && <Swords size={16} color="#fff" />}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 32 }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", overflow: "hidden",
          }}>
            <img src={record.friend.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {record.friend.name}
            </span>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 99,
              background: record.game.color, fontWeight: 500, color: "#374151",
              flexShrink: 0,
            }}>
              {record.game.emoji} { " " } {record.game.name}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>{record.date}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 12, paddingTop: 10,
        borderTop: "2px dashed #E5E7EB",
      }}>
        {/* Wager */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* <div style={{
            width: 50, height: 26, borderRadius: "10px",
            border: "2px solid #fff",
            // boxShadow: `0 2px 0 ${ACCENT2}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: ACCENT }}>Wager: </span>
          </div> */}
          <span style={{ fontSize: 16, fontWeight: 800, color: "#000" }}>
            {record.wager > 0 ? `₦${record.wager.toLocaleString()}` : "FREE"}
          </span>
        </div>

        {/* Action */}
        {isLoss && record.rematchAvailable ? (
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={onRematch}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: LOSS_CLR, color: "#fff",
              fontSize: 11, fontWeight: 900,
              padding: "6px 14px", borderRadius: 99, border: "none",
              cursor: "pointer",
              // boxShadow: "0 3px 0 #B91C1C",
            }}
          >
            <RotateCcw size={12} /> REVENGE!
          </motion.button>
        ) : isWin ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 900, color: ACCENT }}>
            <Star size={13} fill={ACCENT} color={ACCENT} /> +XP earned
          </div>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, color: DRAW_CLR }}>Draw</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── HP Bar (fighting game style) ──────────────────────────────────────── */
// function HPBar({ wins, losses, total }: { wins: number; losses: number; total: number }) {
//   const t = total || 1;
//   const winPct  = Math.round((wins / t) * 100);
//   const lossPct = Math.round((losses / t) * 100);

//   return (
//     <div>
//       <div style={{
//         height: 10, borderRadius: 99, overflow: "hidden",
//         background: "#E5E7EB", display: "flex", gap: 2,
//         border: "2px solid #E5E7EB",
//       }}>
//         <div style={{
//           width: `${winPct}%`, background: `linear-gradient(90deg, ${ACCENT}, #A78BFA)`,
//           borderRadius: "99px 0 0 99px", transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
//         }} />
//         <div style={{
//           width: `${lossPct}%`, background: `linear-gradient(90deg, #F87171, ${LOSS_CLR})`,
//           borderRadius: "0 99px 99px 0", transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
//         }} />
//       </div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
//         <span style={{ fontSize: 9, fontWeight: 700, color: ACCENT }}>YOU</span>
//         <span style={{ fontSize: 9, fontWeight: 700, color: LOSS_CLR }}>{record?.friend?.name ?? "THEM"}</span>
//       </div>
//     </div>
//   );
// }

// /* ─── Rivalry Badge ──────────────────────────────────────────────────────── */
// function RivalryBadge({ friend, onClick }: { friend: FriendRef; onClick: () => void }) {
//   const stats = getRivalryStats(friend.id);
//   const leading = stats.wins > stats.losses;
//   const losing  = stats.losses > stats.wins;
//   const t = stats.total || 1;

//   const border = leading ? WIN_CLR : losing ? LOSS_CLR : "#D1D5DB";
//   const shadow = leading
//     ? `0 5px 0 ${WIN_CLR}55`
//     : losing ? `0 5px 0 ${LOSS_CLR}55`
//     : "0 5px 0 #D1D5DB55";

//   return (
//     <motion.button
//       whileHover={{ scale: 1.04, y: -3 }}
//       whileTap={{ scale: 0.96 }}
//       onClick={onClick}
//       style={{
//         flexShrink: 0, width: 120,
//         background: "#fff",
//         borderRadius: 22,
//         border: `3px solid ${border}`,
//         boxShadow: `${shadow}, 0 6px 16px rgba(0,0,0,0.08)`,
//         padding: "14px 10px 12px",
//         cursor: "pointer", outline: "none",
//         position: "relative",
//       }}
//     >
//       {/* Crown */}
//       {leading && (
//         <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)" }}>
//           <Crown size={20} fill="#FBBF24" color="#F59E0B" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }} />
//         </div>
//       )}

//       {/* Avatar */}
//       <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto 8px" }}>
//         <img
//           src={friend.avatar} alt=""
//           style={{
//             width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
//             border: `3.5px solid ${border}`,
//             boxShadow: `0 3px 0 ${border}66`,
//             display: "block",
//           }}
//         />
//         <div style={{ position: "absolute", bottom: -1, right: -1 }}>
//           <StatusDot status={friend.status} size={13} />
//         </div>
//       </div>

//       {/* Name */}
//       <p style={{ fontSize: 12, fontWeight: 900, color: "#111827", textAlign: "center",
//         margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//         {friend.name}
//       </p>

//       {/* Score */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 8 }}>
//         <span style={{ fontSize: 22, fontWeight: 900, color: leading ? ACCENT : "#D1D5DB",
//           lineHeight: 1, textShadow: leading ? `0 2px 0 ${ACCENT2}` : "none" }}>
//           {stats.wins}
//         </span>
//         <span style={{ fontSize: 12, fontWeight: 800, color: "#D1D5DB" }}>—</span>
//         <span style={{ fontSize: 22, fontWeight: 900, color: losing ? LOSS_CLR : "#D1D5DB",
//           lineHeight: 1, textShadow: losing ? "0 2px 0 #B91C1C" : "none" }}>
//           {stats.losses}
//         </span>
//       </div>

//       {/* HP bar */}
//       <div style={{ width: "100%" }}>
//         <div style={{
//           height: 8, borderRadius: 99, overflow: "hidden",
//           background: "#F3F4F6", display: "flex",
//         }}>
//           <div style={{
//             width: `${Math.round((stats.wins / t) * 100)}%`,
//             background: `linear-gradient(90deg, ${ACCENT}, #A78BFA)`,
//             borderRadius: "99px 0 0 99px",
//             transition: "width 0.5s",
//             minWidth: stats.wins > 0 ? 4 : 0,
//           }} />
//           <div style={{
//             width: `${Math.round((stats.losses / t) * 100)}%`,
//             background: `linear-gradient(90deg, #F87171, ${LOSS_CLR})`,
//             borderRadius: "0 99px 99px 0",
//             transition: "width 0.5s",
//             minWidth: stats.losses > 0 ? 4 : 0,
//           }} />
//         </div>
//       </div>

//       {stats.total === 0 && (
//         <p style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textAlign: "center", marginTop: 6 }}>
//           No battles yet
//         </p>
//       )}
//     </motion.button>
//   );
// }

/* ─── Modal shell ────────────────────────────────────────────────────────── */
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(10,10,20,0.45)",
              backdropFilter: "blur(6px)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 320 }}
            style={{
              position: "relative", width: "100%", maxWidth: 380,
              background: "#fff", borderRadius: 28, overflow: "hidden",
              boxShadow: "0 10px 0 #E5E7EB, 0 24px 48px rgba(0,0,0,0.22)",
              maxHeight: "88vh",
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Head-to-head modal ─────────────────────────────────────────────────── */
function HeadToHeadModal({ friend, onClose }: { friend: FriendRef; onClose: () => void }) {
  const stats = getRivalryStats(friend.id);
  const t = stats.total || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "88vh" }}>

      {/* Purple header */}
      <div style={{
        background: `linear-gradient(135deg, #5B21B6 0%, ${ACCENT} 60%, #A78BFA 100%)`,
        padding: "24px 20px 28px",
        position: "relative",
      }}>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.18)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <X size={16} color="#fff" strokeWidth={2.5} />
        </motion.button>

        {/* Pill label */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.08 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
              borderRadius: 99, padding: "5px 14px",
            }}
          >
            <Swords size={12} color="#fff" />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Rivalry
            </span>
          </motion.div>
        </div>

        {/* VS row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
          <motion.div
            initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
              boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
            }}>
              <img src={CURRENT_USER.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>You</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.18 }}
            style={{
              margin: "0 14px",
              width: 42, height: 42, borderRadius: "50%",
              background: "#fff", boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 900, color: ACCENT }}>VS</span>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
              boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
            }}>
              <img src={friend.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{friend.name}</span>
          </motion.div>
        </div>
      </div>

      {/* Scoreboard strip */}
      <div style={{ display: "flex", borderBottom: "3px solid #F3F4F6" }}>
        {[
          { value: stats.wins,   label: "Wins",   color: WIN_CLR,  bg: "#F0FDF4" },
          { value: stats.draws,  label: "Draws",  color: DRAW_CLR, bg: "#F9FAFB" },
          { value: stats.losses, label: "Losses", color: LOSS_CLR, bg: "#FEF2F2" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "14px 0", textAlign: "center", background: s.bg,
            borderRight: i < 2 ? "2px solid #F3F4F6" : "none",
          }}>
            <motion.p
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.28 + i * 0.07 }}
              style={{ fontSize: 30, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1 }}
            >
              {s.value}
            </motion.p>
            <p style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase",
              letterSpacing: "0.8px", margin: "5px 0 0" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* HP bar in modal */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ height: 10, borderRadius: 99, overflow: "hidden", background: "#F3F4F6", display: "flex" }}>
          <div style={{
            width: `${Math.round((stats.wins / t) * 100)}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #A78BFA)`,
            borderRadius: "99px 0 0 99px", transition: "width 0.6s",
            minWidth: stats.wins > 0 ? 4 : 0,
          }} />
          <div style={{
            width: `${Math.round((stats.losses / t) * 100)}%`,
            background: `linear-gradient(90deg, #F87171, ${LOSS_CLR})`,
            borderRadius: "0 99px 99px 0", transition: "width 0.6s",
            minWidth: stats.losses > 0 ? 4 : 0,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: ACCENT }}>YOU</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: LOSS_CLR }}>{friend.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Match history */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 20px", marginTop: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px",
          color: "#9CA3AF", margin: "0 0 10px 2px" }}>
          Match History
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {stats.records.length === 0
            ? <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "20px 0" }}>
                No battles yet — challenge them!
              </p>
            : stats.records.map(r => <BattleCard key={r.id} record={r} />)
          }
        </div>
      </div>
    </div>
  );
}

/* ─── All battles sheet ──────────────────────────────────────────────────── */
function AllBattlesContent() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? BATTLE_HISTORY
    : BATTLE_HISTORY.filter(r => r.friend.id === filter);

  return (
    <div style={{ padding: "0 16px 32px" }}>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12,
        scrollbarWidth: "none", marginBottom: 4 }}>
        {[{ id:"all", name:"All", avatar: null }, ...FRIENDS_POOL].map((f) => {
          const active = filter === f.id;
          return (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
                padding: "avatar" in f && f.avatar ? "5px 12px 5px 5px" : "6px 14px",
                borderRadius: 99,
                border: `3px solid ${active ? ACCENT : "#E5E7EB"}`,
                background: active ? `${ACCENT}0F` : "#fff",
                color: active ? ACCENT : "#6B7280",
                fontSize: 12, fontWeight: 800,
                cursor: "pointer", outline: "none",
                boxShadow: active ? `0 3px 0 ${ACCENT2}44` : "0 3px 0 #E5E7EB",
                transition: "all 0.15s",
              }}
            >
              {"avatar" in f && f.avatar && (
                <img src={f.avatar} alt="" style={{ width: 22, height: 22, borderRadius: "50%",
                  objectFit: "cover", border: "2px solid #fff" }} />
              )}
              {f.name}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      {filter === "all" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label:"Battles", value:BATTLE_HISTORY.length, color:"#374151", bg:"#F9FAFB", bdr:"#E5E7EB" },
            { label:"Wins",    value:BATTLE_HISTORY.filter(r=>r.result==="win").length,  color:WIN_CLR,  bg:"#F0FDF4", bdr:WIN_CLR  },
            { label:"Losses",  value:BATTLE_HISTORY.filter(r=>r.result==="loss").length, color:LOSS_CLR, bg:"#FEF2F2", bdr:LOSS_CLR },
          ].map(s => (
            <motion.div
              key={s.label}
              whileHover={{ scale: 1.04, y: -2 }}
              style={{
                flex: 1, textAlign: "center", padding: "12px 0",
                borderRadius: 16,
                background: s.bg,
                border: `3px solid ${s.bdr}`,
                boxShadow: `0 4px 0 ${s.bdr}55`,
              }}
            >
              <p style={{ fontSize: 26, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase",
                letterSpacing: "0.6px", margin: "4px 0 0" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => <BattleCard key={r.id} record={r} />)}
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function RecentBattles() {
  const [headToHeadFriend, setHeadToHeadFriend] = useState<FriendRef | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const recent = BATTLE_HISTORY.slice(0, 3);

  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <style>{`*::-webkit-scrollbar{display:none}*{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* ── Rivals ── */}
      {/* <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: ACCENT, border: "3px solid #fff",
            boxShadow: `0 3px 0 ${ACCENT2}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Flame size={16} color="#fff" fill="#fff" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>Your Rivals</h2>
        </div>

        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4,
          marginLeft: -4, paddingLeft: 4 }}>
          {FRIENDS_POOL.map(f => (
            <RivalryBadge key={f.id} friend={f} onClick={() => setHeadToHeadFriend(f)} />
          ))}
        </div>
      </div> */}

      {/* ── Recent Battles ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: ACCENT, border: "3px solid #fff",
              boxShadow: `0 3px 0 ${ACCENT2}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PartyPopper size={16} color="#fff" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#111827", margin: 0 }}>Recent Battles</h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setAllOpen(true)}
            style={{
              fontSize: 12, fontWeight: 800, color: ACCENT,
              background: `${ACCENT}0F`,
              border: `2px solid ${ACCENT}25`,
              borderRadius: 99, padding: "6px 14px", cursor: "pointer",
              boxShadow: `0 3px 0 ${ACCENT2}22`,
            }}
          >
            View All
          </motion.button> */}
        </div>

        <div style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: 8,
            display: 'flex'
          }}
          className="hide-x-scrollbar">
          {recent.map(r => (
            <BattleCard
              key={r.id}
              record={r}
              onClick={() => setHeadToHeadFriend(r.friend)}
              onRematch={(e) => {
                e.stopPropagation();
                console.log("Rematch!", r.friend.name);
              }}
            />
          ))}
        </div>
      </div>

      {/* Head-to-head modal */}
      <Modal isOpen={!!headToHeadFriend} onClose={() => setHeadToHeadFriend(null)}>
        {headToHeadFriend && (
          <HeadToHeadModal friend={headToHeadFriend} onClose={() => setHeadToHeadFriend(null)} />
        )}
      </Modal>

      {/* All battles sheet */}
      <BottomSheet title="Battle History" isOpen={allOpen} onClose={() => setAllOpen(false)} background="#fff">
        <AllBattlesContent />
      </BottomSheet>
    </div>
  );
}
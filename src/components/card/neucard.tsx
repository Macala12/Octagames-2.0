import { useState, CSSProperties } from "react";

const defaultProps = {
  name: "Sepideh Yazdi",
  handle: "@sepidy",
  company: "Happy",
  title: "Product Designer",
  icon: "😊",
};

export default function NeubrutalistCard(props: any) {
  const [data, setData] = useState({ ...defaultProps, ...props });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data);

  const ICONS = ["😊", "🚀", "🎨", "💡", "⚡", "🌱", "🔥", "🎯"];

  function save() {
    setData(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(data);
    setEditing(false);
  }

  return (
    <div style={styles.page}>
      {!editing ? (
        <div style={styles.card}>
          {/* Header row */}
          <div style={styles.header}>
            <span style={styles.name}>{data.name}</span>
            <div style={styles.handleBlock}>{data.handle}</div>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Footer row */}
          <div style={styles.footer}>
            <div style={styles.iconBadge}>{data.icon}</div>
            <div>
              <div style={styles.company}>{data.company}</div>
              <div style={styles.role}>{data.title}</div>
            </div>
          </div>

          {/* Dot row */}
          <div style={styles.dotRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={i % 2 === 0 ? styles.dotAccent : styles.dot}
              />
            ))}
          </div>

          <button style={styles.editBtn} onClick={() => setEditing(true)}>
            ✎ EDIT CARD
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.editTitle}>EDIT CARD</div>

          <div style={styles.formRow}>
            <Field
              label="NAME"
              value={draft.name}
              onChange={(v: any) => setDraft((d: any) => ({ ...d, name: v }))}
            />
            <Field
              label="HANDLE"
              value={draft.handle}
              onChange={(v: any) => setDraft((d: any) => ({ ...d, handle: v }))}
            />
          </div>

          <div style={styles.formRow}>
            <Field
              label="COMPANY / BRAND"
              value={draft.company}
              onChange={(v: any) => setDraft((d: any) => ({ ...d, company: v }))}
            />
            <Field
              label="ROLE / TITLE"
              value={draft.title}
              onChange={(v: any) => setDraft((d: any) => ({ ...d, title: v }))}
            />
          </div>

          <div>
            <div style={styles.label}>ICON</div>
            <div style={styles.iconPicker}>
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  style={{
                    ...styles.iconOpt,
                    ...(draft.icon === ic ? styles.iconOptSelected : {}),
                  }}
                  onClick={() => setDraft((d: any) => ({ ...d, icon: ic }))}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.btnRow}>
            <button style={styles.saveBtn} onClick={save}>
              SAVE
            </button>
            <button style={styles.cancelBtn} onClick={cancel}>
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={styles.label}>{label}</div>
      <input
        style={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const BORDER = "3px solid #111";
const YELLOW = "#f5c842";
const BG = "#fdf6ec";

const styles: { [key: string]: CSSProperties } = {
  page: {
    background: YELLOW,
    minHeight: "340px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    fontFamily: "monospace",
  },
  card: {
    background: BG,
    border: BORDER,
    boxShadow: "6px 6px 0 #111",
    width: "100%",
    maxWidth: "480px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    borderRadius: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  name: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  handleBlock: {
    background: YELLOW,
    border: BORDER,
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
    whiteSpace: "nowrap",
    flexShrink: 0,
    borderRadius: 0,
  },
  divider: {
    height: "3px",
    background: "#111",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconBadge: {
    width: "40px",
    height: "40px",
    border: BORDER,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
    borderRadius: 0,
  },
  company: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111",
  },
  role: {
    fontSize: "14px",
    color: "#444",
  },
  dotRow: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    background: "#111",
    borderRadius: 0,
  },
  dotAccent: {
    width: "10px",
    height: "10px",
    background: YELLOW,
    border: "2px solid #111",
    borderRadius: 0,
  },
  editBtn: {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.5px",
    alignSelf: "flex-start",
    borderRadius: 0,
    fontFamily: "monospace",
  },
  editTitle: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#111",
  },
  formRow: {
    display: "flex",
    gap: "12px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#555",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontFamily: "monospace",
  },
  input: {
    border: "2px solid #111",
    background: "#fff",
    color: "#111",
    fontSize: "14px",
    fontFamily: "monospace",
    padding: "6px 10px",
    width: "100%",
    fontWeight: 500,
    borderRadius: 0,
    outline: "none",
    boxSizing: "border-box",
  },
  iconPicker: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginTop: "4px",
  },
  iconOpt: {
    border: "2px solid #bbb",
    background: "#fff",
    padding: "4px 8px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: 0,
    fontFamily: "monospace",
  },
  iconOptSelected: {
    border: "2px solid #111",
    boxShadow: "2px 2px 0 #111",
  },
  btnRow: {
    display: "flex",
    gap: "8px",
  },
  saveBtn: {
    background: YELLOW,
    color: "#111",
    border: "2px solid #111",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: 0,
    fontFamily: "monospace",
  },
  cancelBtn: {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: 0,
    fontFamily: "monospace",
  },
};
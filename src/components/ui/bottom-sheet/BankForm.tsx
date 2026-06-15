import { useState, useEffect, useRef } from "react";

const BANKS = [
  "Access Bank", "GTBank", "Zenith Bank", "First Bank",
  "UBA", "Kuda", "Opay", "Moniepoint", "Stanbic IBTC",
  "Fidelity Bank", "Sterling Bank", "Wema Bank", "Polaris Bank",
];

async function lookupAccountName(bank: string, accountNumber: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1400));
  const names: Record<string, string> = {
    "0123456789": "ADEWALE JOHN SEUN",
    "9876543210": "QUEEN BLESSING UCHE",
    "1122334455": "MICHAEL TUNDE OJO",
  };
  return names[accountNumber] ?? "OLUWASEUN IBRAHIM TAYO";
}

type Step = "form" | "success";

interface AddBankFormProps {
  onSuccess: (card: { id: string; bankName: string; accountNumber: string; accountName: string }) => void;
  onCancel: () => void;
}

// ─── Tokens for light background ─────────────────────────────────────────────
const T = {
  bg:           "#ffffff",
  surface:      "#f5f5f7",
  surfaceHover: "#ececef",
  border:       "rgba(0,0,0,0.09)",
  borderFocus:  "#7C3AED",
  text:         "#111111",
  textSub:      "#555555",
  textHint:     "#999999",
  label:        "#444444",
  accent:       "#7C3AED",
  accentLight:  "rgba(124,58,237,0.08)",
  yellow:       "#7C3AED",
  yellowText:   "#111111",
  green:        "#16a34a",
  greenLight:   "rgba(22,163,74,0.08)",
  greenBorder:  "rgba(22,163,74,0.25)",
  danger:       "#dc2626",
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", color: T.label,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%", padding: "13px 14px",
  borderRadius: 12, fontSize: 14, fontWeight: 500,
  background: T.surface,
  border: `1.5px solid ${T.border}`,
  color: T.text, outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ bankName, accountName, accountNumber, onDone }: {
  bankName: string; accountName: string; accountNumber: string; onDone: () => void;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "10px 0 4px",
      animation: "fadeUp 0.4s ease both",
    }}>
      <style>{`
        @keyframes popIn    { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes ringPulse{ 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes fadeUp   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Checkmark */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: T.greenLight,
          border: `2px solid ${T.greenBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: `1.5px solid ${T.greenBorder}`,
          animation: "ringPulse 1.5s ease 0.5s infinite",
        }} />
      </div>

      <p style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: 0, marginBottom: 6 }}>
        Bank Added!
      </p>
      <p style={{ fontSize: 13, color: T.textSub, margin: 0, marginBottom: 24, textAlign: "center", lineHeight: 1.6 }}>
        Your bank account has been linked successfully
      </p>

      {/* Card preview */}
      <div style={{
        width: "100%", borderRadius: 16, padding: "16px 18px",
        background: T.surface, border: `1.5px solid ${T.border}`,
        marginBottom: 24, display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: T.accent, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: 1,
        }}>
          {bankName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, color: T.textHint, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {bankName}
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: T.text, fontFamily: "monospace", letterSpacing: "0.1em" }}>
            {accountNumber.slice(0, 3)}••••{accountNumber.slice(-3)}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: T.textSub, fontWeight: 600, textTransform: "uppercase" }}>
            {accountName}
          </p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={T.green} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <button
        onClick={onDone}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          background: T.yellow, border: "none",
          fontSize: 14, fontWeight: 800, color: T.yellowText,
          cursor: "pointer",
        }}
      >
        Done
      </button>
    </div>
  );
}

// ─── Add Bank Form ────────────────────────────────────────────────────────────
export function AddBankForm({ onSuccess, onCancel }: AddBankFormProps) {
  const [step, setStep]                   = useState<Step>("form");
  const [bank, setBank]                   = useState("");
  const [bankOpen, setBankOpen]           = useState(false);
  const [bankSearch, setBankSearch]       = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName]     = useState("");
  const [lookingUp, setLookingUp]         = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [savedCard, setSavedCard]         = useState<any>(null);
  const [focused, setFocused]             = useState(false);
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  const filteredBanks = BANKS.filter((b) =>
    b.toLowerCase().includes(bankSearch.toLowerCase())
  );

  useEffect(() => {
    if (accountNumber.length === 10 && bank) {
      setLookingUp(true);
      setAccountName("");
      lookupAccountName(bank, accountNumber).then((name) => {
        setAccountName(name);
        setLookingUp(false);
      });
    } else {
      setAccountName("");
    }
  }, [accountNumber, bank]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBankOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const canSubmit = bank && accountNumber.length === 10 && accountName && !lookingUp;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const card = { id: Date.now().toString(), bankName: bank, accountNumber, accountName };
    setSavedCard(card);
    setStep("success");
    setSubmitting(false);
  };

  if (step === "success" && savedCard) {
    return (
      <SuccessScreen
        bankName={savedCard.bankName}
        accountName={savedCard.accountName}
        accountNumber={savedCard.accountNumber}
        onDone={() => onSuccess(savedCard)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <style>{`
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        .bank-opt:hover     { background: ${T.surfaceHover} !important; }
        .acc-inp:focus      { border-color: ${T.borderFocus} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important; }
        .bank-btn:focus     { border-color: ${T.borderFocus} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important; }
        .srch-inp:focus     { border-color: ${T.borderFocus} !important; }
      `}</style>

      {/* Bank selector */}
      <Field label="Bank Name">
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            className="bank-btn"
            onClick={() => setBankOpen((o) => !o)}
            style={{
              ...inputBase,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", textAlign: "left",
              color: bank ? T.text : T.textHint,
            }}
          >
            <span style={{ fontWeight: bank ? 600 : 400 }}>{bank || "Select bank"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={T.textHint} strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: bankOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {bankOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
              background: T.bg,
              border: `1.5px solid ${T.border}`,
              borderRadius: 14, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              animation: "fadeDown 0.2s ease both",
            }}>
              <div style={{ padding: "10px 10px 6px" }}>
                <input
                  className="srch-inp"
                  autoFocus
                  placeholder="Search bank..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  style={{
                    ...inputBase,
                    padding: "9px 12px", fontSize: 13,
                    background: T.surface,
                  }}
                />
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {filteredBanks.length === 0 ? (
                  <p style={{ padding: "12px 14px", fontSize: 12, color: T.textHint, margin: 0 }}>
                    No banks found
                  </p>
                ) : filteredBanks.map((b) => (
                  <button
                    key={b}
                    className="bank-opt"
                    onClick={() => { setBank(b); setBankOpen(false); setBankSearch(""); }}
                    style={{
                      width: "100%", padding: "11px 14px", textAlign: "left",
                      background: bank === b ? T.accentLight : "transparent",
                      border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 600,
                      color: bank === b ? T.accent : T.text,
                      transition: "background 0.15s",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* Account number */}
      <Field label="Account Number">
        <input
          className="acc-inp"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="0000000000"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
          style={{ ...inputBase, letterSpacing: "0.12em", fontFamily: "monospace" }}
        />
        <p style={{ fontSize: 10, color: T.textHint, margin: 0, textAlign: "right", letterSpacing: "0.05em" }}>
          {accountNumber.length}/10
        </p>
      </Field>

      {/* Account name lookup */}
      <div style={{ minHeight: 54 }}>
        {lookingUp && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 14px", borderRadius: 12,
            background: T.surface, border: `1.5px solid ${T.border}`,
            animation: "fadeUp 0.2s ease both",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={T.accent} strokeWidth="2.5"
              style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span style={{ fontSize: 13, color: T.textSub, fontWeight: 600 }}>
              Verifying account…
            </span>
          </div>
        )}

        {accountName && !lookingUp && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 14px", borderRadius: 12,
            background: T.greenLight, border: `1.5px solid ${T.greenBorder}`,
            animation: "fadeUp 0.25s ease both",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: T.greenBorder,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={T.green} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 10, color: T.green, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Account Name
              </p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "0.04em" }}>
                {accountName}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          background: canSubmit ? T.yellow : T.surface,
          border: `1.5px solid ${canSubmit ? "transparent" : T.border}`,
          fontSize: 14, fontWeight: 800,
          color: canSubmit ? T.yellowText : T.textHint,
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "all 0.25s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        {submitting ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={T.yellowText} strokeWidth="2.5"
              style={{ animation: "spin 0.8s linear infinite" }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Adding bank…
          </>
        ) : "Add Bank Account"}
      </button>

      {/* Cancel */}
      <button
        onClick={onCancel}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 700, color: T.textHint,
          padding: "4px 0", marginTop: -8,
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = T.text)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textHint)}
      >
        Cancel
      </button>
    </div>
  );
}
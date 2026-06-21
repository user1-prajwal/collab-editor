import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

//  INJECT GLOBAL CSS ONCE 
function injectGlobal() {
  if (document.getElementById("ce-global")) return;
  const s = document.createElement("style");
  s.id = "ce-global";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #09090B; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    @keyframes blink   { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes fadeIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

    @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
    .ce-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
    .ce-card:hover { border-color: rgba(99,102,241,0.4) !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
    .ce-btn-primary { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
    .ce-btn-primary:hover { background: #818CF8 !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.4); }
    .ce-btn-primary:active { transform: translateY(0); }
    .ce-btn-ghost { transition: border-color 0.15s, color 0.15s; }
    .ce-btn-ghost:hover { border-color: rgba(99,102,241,0.5) !important; color: #F8FAFC !important; }
    .ce-nav-link { transition: color 0.15s; }
    .ce-nav-link:hover { color: #F8FAFC !important; }
    .ce-faq-btn { transition: color 0.15s; }
    .ce-faq-btn:hover { color: #818CF8 !important; }
    .ce-input:focus { border-color: rgba(99,102,241,0.6) !important; }
    .ce-social:hover { border-color: rgba(99,102,241,0.5) !important; color: #F8FAFC !important; }
    .ce-step-card { transition: border-color 0.2s; }
    .ce-step-card:hover { border-color: rgba(99,102,241,0.35) !important; }
    @media (max-width: 768px) {
      .hero-grid { flex-direction: column !important; }
      .hero-left { width: 100% !important; }
      .hero-right { display: none !important; }
      .hide-mobile { display: none !important; }
    }
  `;
  document.head.appendChild(s);
}

// ─── TINY ICONS (pure SVG, no emoji, no external deps) ───────────
const Ico = {
  Bolt: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
    </svg>
  ),
  Play: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill={p.c || "currentColor"}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Users: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Msg: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Folder: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Globe: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Check: (p) => (
    <svg
      width={p.s || 14}
      height={p.s || 14}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "#10B981"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Arrow: (p) => (
    <svg
      width={p.s || 14}
      height={p.s || 14}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  ),
  Plus: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={p.c || "currentColor"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Github: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill={p.c || "currentColor"}
    >
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.4 7.86 10.94.57.1.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.32-1.29-1.67-1.29-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.42.36.78 1.07.78 2.16v3.2c0 .31.21.65.8.55A10.99 10.99 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  ),
  In: (p) => (
    <svg
      width={p.s || 16}
      height={p.s || 16}
      viewBox="0 0 24 24"
      fill={p.c || "currentColor"}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  ),
};

// ─ EDITOR PREVIEW (the animated code widget) 
// All data at module level — no hooks, no mutations, no linter issues
const LINES = [
  {
    tokens: [
      { t: "const ", c: "#818CF8" },
      { t: "socket", c: "#93C5FD" },
      { t: " = ", c: "#94A3B8" },
      { t: "createRoom", c: "#34D399" },
      { t: "()", c: "#E2E8F0" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { t: "socket", c: "#34D399" },
      { t: ".on(", c: "#E2E8F0" },
      { t: "'code-change'", c: "#FCD34D" },
      { t: ", data => {", c: "#E2E8F0" },
    ],
  },
  {
    tokens: [
      { t: "  editor", c: "#93C5FD" },
      { t: ".setValue(", c: "#E2E8F0" },
      { t: "data.code", c: "#FCD34D" },
      { t: ")", c: "#E2E8F0" },
    ],
  },
  { tokens: [{ t: "})", c: "#E2E8F0" }] },
];

// Flat array of every character with its colour and which line it belongs to
const CHARS = LINES.flatMap((line, li) =>
  line.tokens.flatMap((tok) =>
    tok.t.split("").map((ch) => ({ ch, c: tok.c, li })),
  ),
);
const TOTAL = CHARS.length;

const PEERS = [
  { name: "Alex", color: "#34D399" },
  { name: "Maya", color: "#F472B6" },
  { name: "Ravi", color: "#60A5FA" },
];

function EditorPreview() {
  const [n, setN] = useState(0);
  const [peerIdx, setPeerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= TOTAL ? 0 : v + 2)), 55);
    const p = setInterval(
      () => setPeerIdx((v) => (v + 1) % PEERS.length),
      1800,
    );
    return () => {
      clearInterval(t);
      clearInterval(p);
    };
  }, []);

  // Build lines from flat char array — pure, no mutation
  const renderedLines = LINES.map((_, li) => {
    const lineStart = CHARS.findIndex((ch) => ch.li === li);
    const lineChars = CHARS.filter((ch) => ch.li === li);
    const visible =
      lineStart < 0 ? [] : lineChars.slice(0, Math.max(0, n - lineStart));
    return visible;
  });

  const activePeer = PEERS[peerIdx];

  return (
    <div
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        fontFamily: '"JetBrains Mono","Fira Code",monospace',
        background: "#0D1117",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: "#161B22",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {["#EF4444", "#F59E0B", "#22C55E"].map((bg) => (
            <div
              key={bg}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: bg,
              }}
            />
          ))}
        </div>
        <span
          style={{
            color: "#6B7280",
            fontSize: "11px",
            fontFamily: "Inter,sans-serif",
          }}
        >
          room/index.js
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10B981",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              color: "#10B981",
              fontSize: "11px",
              fontFamily: "Inter,sans-serif",
              fontWeight: 600,
            }}
          >
            {PEERS.length} live
          </span>
        </div>
      </div>

      {/* Peer pills */}
      <div
        style={{
          background: "#0D1117",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "7px 14px",
          display: "flex",
          gap: "7px",
        }}
      >
        {PEERS.map((peer, i) => (
          <div
            key={peer.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "2px 9px",
              borderRadius: "999px",
              background: `${peer.color}15`,
              border: `1px solid ${peer.color}35`,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: peer.color,
              }}
            />
            <span
              style={{
                color: peer.color,
                fontSize: "11px",
                fontFamily: "Inter,sans-serif",
                fontWeight: 600,
              }}
            >
              {peer.name}
            </span>
            {i === peerIdx && (
              <span
                style={{ color: peer.color, fontSize: "10px", opacity: 0.7 }}
              >
                typing
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Code area */}
      <div
        style={{ padding: "18px 0", minHeight: "150px", background: "#0D1117" }}
      >
        {renderedLines.map((chars, li) => (
          <div
            key={li}
            style={{ display: "flex", minHeight: "21px", padding: "1px 0" }}
          >
            <span
              style={{
                width: "36px",
                textAlign: "right",
                paddingRight: "14px",
                color: "#374151",
                fontSize: "12px",
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              {li + 1}
            </span>
            <span
              style={{
                fontSize: "13px",
                lineHeight: "21px",
                whiteSpace: "pre",
              }}
            >
              {chars.map((ch, i) => (
                <span key={i} style={{ color: ch.c }}>
                  {ch.ch}
                </span>
              ))}
              {li === peerIdx % LINES.length && chars.length > 0 && (
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "14px",
                    background: activePeer.color,
                    verticalAlign: "middle",
                    marginLeft: "1px",
                    animation: "blink 1s steps(1) infinite",
                  }}
                />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        style={{
          background: "#161B22",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "5px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#374151",
            fontSize: "11px",
            fontFamily: "Inter,sans-serif",
          }}
        >
          JavaScript
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#10B981",
            }}
          />
          <span
            style={{
              color: "#10B981",
              fontSize: "11px",
              fontFamily: "Inter,sans-serif",
            }}
          >
            All changes saved
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR 
function Navbar({ onOpen }) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const fn = () => setPinned(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        justifyContent: "space-between",
        background: pinned ? "rgba(9,9,11,0.9)" : "transparent",
        backdropFilter: pinned ? "blur(12px)" : "none",
        borderBottom: pinned
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "all 0.25s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "7px",
            background: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ico.Bolt s={14} c="#fff" />
        </div>
        <span
          style={{
            color: "#F8FAFC",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "-0.3px",
          }}
        >
          Collab Editor
        </span>
      </div>

      {/* Links */}
      <div className="hide-mobile" style={{ display: "flex", gap: "28px" }}>
        {[
          ["#features", "Features"],
          ["#how", "How it works"],
          ["#faq", "FAQ"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="ce-nav-link"
            style={{
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="ce-btn-primary"
        onClick={onOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 18px",
          background: "#6366F1",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "Inter,sans-serif",
        }}
      >
        Open Editor <Ico.Arrow s={13} c="#fff" />
      </button>
    </nav>
  );
}

// ─── HERO 
function Hero({ onOpen }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function join() {
    const v = code.trim().toUpperCase();
    if (!v) {
      setErr("Please enter a room code");
      return;
    }
    if (!/^[A-Z0-9]{6}$/.test(v)) {
      setErr("Room code must be 6 characters");
      return;
    }
    navigate(`/room/${v}`);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient — subtle, no blush */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-grid"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          maxWidth: "1160px",
          margin: "0 auto",
          width: "100%",
          padding: "110px 32px 60px",
          gap: "56px",
        }}
      >
        {/* LEFT — copy */}
        <div
          className="hero-left"
          style={{
            flex: "0 0 auto",
            width: "480px",
            animation: "fadeIn 0.5s ease both",
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: "-2px",
              color: "#F8FAFC",
              marginBottom: "20px",
            }}
          >
            Code together,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              like you're in the same room.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#94A3B8",
              marginBottom: "36px",
            }}
          >
            Share a 6-character code. Your teammate opens it. You're both
            looking at the same editor, typing at the same time — live.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            <button
              className="ce-btn-primary"
              onClick={onOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "13px 28px",
                background: "#6366F1",
                border: "none",
                borderRadius: "9px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              <Ico.Bolt s={15} c="#fff" /> Create a room
            </button>

            <div
              style={{
                display: "flex",
                borderRadius: "9px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <input
                className="ce-input"
                value={code}
                onChange={(e) => {
                  setCode(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                  );
                  setErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && join()}
                maxLength={6}
                placeholder="Enter code"
                style={{
                  width: "130px",
                  padding: "13px 13px",
                  background: "#18181B",
                  border: "none",
                  color: "#F8FAFC",
                  fontSize: "14px",
                  fontFamily: '"JetBrains Mono","Fira Code",monospace',
                  letterSpacing: "3px",
                  fontWeight: 600,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                className="ce-btn-ghost"
                onClick={join}
                style={{
                  padding: "13px 16px",
                  background: "#27272A",
                  border: "none",
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Inter,sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Join <Ico.Arrow s={13} />
              </button>
            </div>
          </div>

          {err && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {err}
            </p>
          )}

          {/* Trust */}
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            {["No login needed", "Runs in your browser", "Free forever"].map(
              (t) => (
                <span
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#6B7280",
                    fontSize: "13px",
                  }}
                >
                  <Ico.Check s={13} c="#10B981" /> {t}
                </span>
              ),
            )}
          </div>
        </div>

        {/* RIGHT — editor preview */}
        <div
          className="hero-right"
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            animation: "fadeIn 0.7s ease 0.15s both",
          }}
        >
          <EditorPreview />

          {/* Floating activity */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {[
              { dot: "#F472B6", text: "Maya is editing line 3", delay: "0s" },
              {
                dot: "#10B981",
                text: "Output: [200 OK]",
                delay: "0.6s",
                green: true,
              },
            ].map((chip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 13px",
                  borderRadius: "8px",
                  background: "#18181B",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animation: `floatUp ${3 + i}s ease-in-out ${chip.delay} infinite`,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: chip.dot,
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: chip.green ? "#10B981" : "#94A3B8",
                    fontWeight: chip.green ? 600 : 400,
                  }}
                >
                  {chip.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: "24px",
          color: "#374151",
          fontSize: "12px",
          animation: "pulse 3s infinite",
        }}
      >
        scroll to explore
      </div>
    </div>
  );
}

// ─── WHAT YOU GET 
function Features() {
  const list = [
    {
      Icon: Ico.Users,
      color: "#6366F1",
      title: "See everyone typing",
      desc: "Every keystroke syncs instantly. You'll see your teammate's cursor moving in real time with their name tag on it.",
    },
    {
      Icon: Ico.Play,
      color: "#10B981",
      title: "Run code together",
      desc: "Hit Run and the output appears for everyone in the room. JavaScript, Python, Java, and C++ — all supported.",
    },
    {
      Icon: Ico.Msg,
      color: "#F472B6",
      title: "Chat without switching tabs",
      desc: "A built-in chat panel sits next to your editor. No Slack, no Discord, no context switching.",
    },
    {
      Icon: Ico.Folder,
      color: "#3B82F6",
      title: "Multiple files, one room",
      desc: "Add as many files as you need. Everyone switches between them together. Great for small projects and interviews.",
    },
    {
      Icon: Ico.Bolt,
      color: "#F59E0B",
      title: "Under 50ms sync",
      desc: "Edits travel over a persistent WebSocket connection — no polling, no page refreshes, no visible lag.",
    },
    {
      Icon: Ico.Globe,
      color: "#34D399",
      title: "Open it, share it, done",
      desc: "No account. No install. Just open the link, create a room, and send a 6-character code to anyone.",
    },
  ];

  return (
    <div
      id="features"
      style={{
        background: "#0F0F11",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 32px" }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              color: "#6366F1",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            What you get
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#F8FAFC",
              marginBottom: "14px",
            }}
          >
            Everything you need to code together
          </h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: "16px",
              lineHeight: 1.7,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            No fluff. No pairing extensions. Just open a room and start writing.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {list.map((item) => (
            <div
              key={item.title}
              className="ce-card"
              style={{
                background: "#09090B",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "26px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <item.Icon s={20} c={item.color} />
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#F8FAFC",
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{ fontSize: "14px", lineHeight: 1.65, color: "#6B7280" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOW IT WORKS 
function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Create a room",
      desc: 'Click "Create a room". You get a unique 6-character code — like K9MX2A. That is your room.',
      detail: (
        <div
          style={{
            marginTop: "16px",
            padding: "14px 16px",
            background: "#09090B",
            borderRadius: "9px",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            fontSize: "13px",
          }}
        >
          <span style={{ color: "#10B981" }}>Room </span>
          <span
            style={{ color: "#FCD34D", fontWeight: 700, letterSpacing: "2px" }}
          >
            K9MX2A
          </span>
          <span style={{ color: "#6B7280" }}> — ready</span>
        </div>
      ),
    },
    {
      n: "2",
      title: "Share the code",
      desc: "Send that 6-character code to your teammate over chat, email, or a sticky note. They type it in and they're instantly in your editor.",
      detail: (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {[
            { name: "Alex", c: "#34D399" },
            { name: "Maya", c: "#F472B6" },
            { name: "Ravi", c: "#60A5FA" },
          ].map((u) => (
            <div
              key={u.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 11px",
                borderRadius: "8px",
                background: "#09090B",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: u.c,
                }}
              />
              <span style={{ color: "#94A3B8", fontSize: "12px" }}>
                {u.name} joined
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      n: "3",
      title: "Code together, live",
      desc: "You're both in the same editor. Type anywhere, run code, chat — everything syncs the moment it happens.",
      detail: (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "8px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10B981",
              fontSize: "12px",
            }}
          >
            <Ico.Check s={12} c="#10B981" /> Output: "Hello, world!"
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "8px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#818CF8",
              fontSize: "12px",
            }}
          >
            <Ico.Msg s={12} c="#818CF8" /> Maya: "Ship it!"
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="how">
      <div
        style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p
            style={{
              color: "#6366F1",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#F8FAFC",
            }}
          >
            Three steps. Thirty seconds.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {steps.map((s) => (
            <div
              key={s.n}
              className="ce-step-card"
              style={{
                background: "#0F0F11",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "9px",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                  fontWeight: 800,
                  fontSize: "15px",
                  marginBottom: "16px",
                  fontFamily: '"JetBrains Mono","Fira Code",monospace',
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#F8FAFC",
                  marginBottom: "10px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{ fontSize: "14px", lineHeight: 1.65, color: "#6B7280" }}
              >
                {s.desc}
              </p>
              {s.detail}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ 
function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    {
      q: "Is it actually free?",
      a: "Yes, completely. No paid plan, no trial, no credit card. The project is open source under the MIT license.",
    },
    {
      q: "Do I need an account?",
      a: "No. Open the site, create a room, share the code. We do not store any user data.",
    },
    {
      q: "What languages can I run?",
      a: "JavaScript, Python, Java, and C++. TypeScript editing is supported with syntax highlighting, and execution support is coming.",
    },
    {
      q: "What happens to my code when everyone leaves?",
      a: "The session is cleared from memory. Rooms are not persisted to a database. Use the Export button to download your files as a ZIP before closing.",
    },
    {
      q: "How many people can join a room?",
      a: "There is no enforced limit. In practice 2–6 people works best for focused collaboration.",
    },
    {
      q: "Can I self-host this?",
      a: "Yes. The source is on GitHub. The frontend is React + Vite, the backend is Node.js + Express + Socket.io. Straightforward to deploy on any server.",
    },
  ];

  return (
    <div
      id="faq"
      style={{
        background: "#0F0F11",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{ maxWidth: "680px", margin: "0 auto", padding: "96px 32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              color: "#6366F1",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#F8FAFC",
            }}
          >
            Common questions
          </h2>
        </div>

        {items.map((item, i) => (
          <div
            key={i}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              className="ce-faq-btn"
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#F8FAFC",
                fontFamily: "Inter,sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                textAlign: "left",
                padding: "20px 0",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  flexShrink: 0,
                  color: "#6B7280",
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                  display: "flex",
                }}
              >
                <Ico.Plus s={17} c="#6B7280" />
              </span>
            </button>
            {open === i && (
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "14.5px",
                  lineHeight: 1.75,
                  paddingBottom: "22px",
                  animation: "fadeIn 0.15s ease",
                }}
              >
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA 
// ─── NETWORK VISUALIZATION 
// One central "room" node + collaborator nodes drifting around it.


const PEER_NAMES = [
  "Alex",
  "Maya",
  "Ravi",
  "Priya",
  "Jordan",
  "Sam",
  "Wei",
  "Noah",
];

function NetworkViz() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const tooltipRef = useRef(null);
  const stateRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const tooltip = tooltipRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    const NUM_PEERS = 8;
    const CONNECT_DIST = 95;
    const MOUSE_RADIUS = 80;
    const HOVER_RADIUS = 16;
    const MIN_PEER_DIST = 30; // no two collaborator nodes may get closer than this
    const MIN_ROOM_DIST = 48; // collaborators always keep clear of the room icon

    function resize() {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0,
      );
      return { w: rect.width, h: rect.height };
    }

    let { w, h } = resize();

    // Node 0 is always the room — every peer orbits it
    const center = {
      x: w / 2,
      y: h / 2,
      isRoom: true,
      r: 9,
      vx: 0,
      vy: 0,
      name: "Room",
    };
    const peers = Array.from({ length: NUM_PEERS }, (_, i) => {
      const angle = (i / NUM_PEERS) * Math.PI * 2;
      const dist =
        Math.min(w, h) * 0.28 + Math.random() * (Math.min(w, h) * 0.12);
      return {
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 4 + Math.random() * 1.2,
        isRoom: false,
        name: PEER_NAMES[i % PEER_NAMES.length],
      };
    });
    const nodes = [center, ...peers];

    // Packets always travel peer <-> room (index 0) — tells the actual story
    const packets = [];
    function spawnPacket() {
      const peerIdx = 1 + Math.floor(Math.random() * NUM_PEERS);
      const toRoom = Math.random() < 0.5;
      packets.push({
        a: toRoom ? peerIdx : 0,
        b: toRoom ? 0 : peerIdx,
        t: 0,
        speed: 0.012 + Math.random() * 0.01,
      });
    }
    const spawnTimer = setInterval(() => {
      if (Math.random() < 0.8) spawnPacket();
    }, 650);

    // Broadcast pulse rings — periodically expand outward from the room,
    // visually saying "this is the hub everything radiates from"
    const pulses = [];
    function spawnPulse() {
      pulses.push({ r: 10, op: 0.5 });
    }
    const pulseTimer = setInterval(spawnPulse, 2600);
    spawnPulse();

    // Auto-highlight — every ~2-3s, spotlight a random collaborator with
    // their name + a "typing" indicator, with no mouse interaction needed.
    // This is what makes the room feel alive even if nobody touches it.
    const highlight = { idx: null, until: 0 };
    function triggerHighlight() {
      highlight.idx = 1 + Math.floor(Math.random() * NUM_PEERS);
      highlight.until = performance.now() + 1500;
    }
    const highlightTimer = setInterval(
      triggerHighlight,
      2200 + Math.random() * 900,
    );
    setTimeout(triggerHighlight, 900);

    stateRef.current = { nodes, packets, pulses, raf: null };

    function onMouseMove(e) {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false };
      if (tooltip) tooltip.style.opacity = "0";
    }
    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);

    function onResize() {
      const r = resize();
      w = r.w;
      h = r.h;
    }
    window.addEventListener("resize", onResize);

    function step() {
      const { nodes: ns, packets: pk, pulses: ps } = stateRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update peer positions — drift + soft pull toward room + cursor attraction
      for (let i = 1; i < ns.length; i++) {
        const node = ns[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 16 || node.x > w - 16) node.vx *= -1;
        if (node.y < 16 || node.y > h - 16) node.vy *= -1;

        const dx = ns[0].x - node.x;
        const dy = ns[0].y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        node.vx += (dx / dist) * 0.0007;
        node.vy += (dy / dist) * 0.0007;

        if (mouse.active) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < MOUSE_RADIUS) {
            const force = (1 - mdist / MOUSE_RADIUS) * 0.045;
            node.vx += (mdx / mdist) * force;
            node.vy += (mdy / mdist) * force;
          }
        }

        node.vx *= 0.985;
        node.vy *= 0.985;
      }

      // Collision separation — push apart any pair that has drifted too
      // close, including peer-vs-room, so nothing ever visually overlaps.
      // Standard force-directed-graph technique: direct positional
      // correction rather than velocity, since it converges immediately
      // instead of needing strong springy forces that cause jitter.
      for (let i = 1; i < ns.length; i++) {
        // peer vs room — room never moves, so push the peer fully clear
        const dxr = ns[i].x - ns[0].x;
        const dyr = ns[i].y - ns[0].y;
        const distr = Math.sqrt(dxr * dxr + dyr * dyr) || 0.001;
        if (distr < MIN_ROOM_DIST) {
          const push = MIN_ROOM_DIST - distr;
          ns[i].x += (dxr / distr) * push;
          ns[i].y += (dyr / distr) * push;
        }
        // peer vs peer — split the correction between both nodes
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[j].x - ns[i].x;
          const dy = ns[j].y - ns[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < MIN_PEER_DIST) {
            const push = (MIN_PEER_DIST - dist) * 0.5;
            ns[i].x -= (dx / dist) * push;
            ns[i].y -= (dy / dist) * push;
            ns[j].x += (dx / dist) * push;
            ns[j].y += (dy / dist) * push;
          }
        }
      }

      // Broadcast pulses — expand + fade, drawn behind everything else
      for (let p = ps.length - 1; p >= 0; p--) {
        const pulse = ps[p];
        pulse.r += 1.1;
        pulse.op *= 0.965;
        if (pulse.op < 0.02) {
          ps.splice(p, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(ns[0].x, ns[0].y, pulse.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${pulse.op})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Connections — every peer always has a faint line to the room (it's
      // always "connected"), plus nearby peer-to-peer lines fade in by distance
      for (let i = 1; i < ns.length; i++) {
        const dxr = ns[i].x - ns[0].x;
        const dyr = ns[i].y - ns[0].y;
        const distr = Math.sqrt(dxr * dxr + dyr * dyr);
        const opr = Math.max(0.12, 0.45 * (1 - distr / Math.max(w, h)));
        ctx.strokeStyle = `rgba(129,140,248,${opr})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ns[0].x, ns[0].y);
        ctx.lineTo(ns[i].x, ns[i].y);
        ctx.stroke();
      }
      for (let i = 1; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x;
          const dy = ns[i].y - ns[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const op = (1 - dist / CONNECT_DIST) * 0.16;
            ctx.strokeStyle = `rgba(255,255,255,${op})`;
            ctx.beginPath();
            ctx.moveTo(ns[i].x, ns[i].y);
            ctx.lineTo(ns[j].x, ns[j].y);
            ctx.stroke();
          }
        }
      }

      // Advance + draw packets (always peer <-> room)
      for (let p = pk.length - 1; p >= 0; p--) {
        const pkt = pk[p];
        pkt.t += pkt.speed;
        if (pkt.t >= 1) {
          pk.splice(p, 1);
          continue;
        }
        const A = ns[pkt.a];
        const B = ns[pkt.b];
        if (!A || !B) {
          pk.splice(p, 1);
          continue;
        }
        const px = A.x + (B.x - A.x) * pkt.t;
        const py = A.y + (B.y - A.y) * pkt.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(129,140,248,0.9)";
        ctx.shadowColor = "rgba(99,102,241,0.7)";
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Nodes — room gets a halo + a tiny house glyph so it visually
      // reads as "a place", peers are plain light dots ("people")
      for (let i = 0; i < ns.length; i++) {
        const node = ns[i];
        if (node.isRoom) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 7, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(99,102,241,0.14)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fillStyle = "#818CF8";
          ctx.fill();

          // Tiny house glyph: roof (triangle) + base (rectangle), drawn in
          // the room's own dark tone so it reads at a glance as "a place"
          const gx = node.x,
            gy = node.y;
          ctx.fillStyle = "rgba(13,15,26,0.85)";
          ctx.beginPath();
          ctx.moveTo(gx, gy - 4.2);
          ctx.lineTo(gx + 4, gy - 0.5);
          ctx.lineTo(gx - 4, gy - 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(gx - 2.6, gy - 0.5, 5.2, 4.2);
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(228,228,231,0.85)";
          ctx.fill();
        }
      }

      // Tooltip — hover takes priority (shows plain name / room label).
      // If not hovering, fall back to the auto-highlight cycle, which
      // spotlights a random collaborator with a "typing" indicator on
      // its own, so the visualization tells its story passively too.
      if (tooltip) {
        let nearest = null;
        let nearestDist = HOVER_RADIUS;
        if (mouse.active) {
          for (let i = 0; i < ns.length; i++) {
            const dx = ns[i].x - mouse.x;
            const dy = ns[i].y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = ns[i];
            }
          }
        }

        if (nearest) {
          tooltip.textContent = nearest.isRoom
            ? "Room — shared workspace"
            : nearest.name;
          tooltip.style.left = nearest.x + "px";
          tooltip.style.top = nearest.y - nearest.r - 10 + "px";
          tooltip.style.opacity = "1";
        } else if (
          highlight.idx !== null &&
          performance.now() < highlight.until
        ) {
          const node = ns[highlight.idx];
          if (node) {
            tooltip.textContent = `${node.name} is typing…`;
            tooltip.style.left = node.x + "px";
            tooltip.style.top = node.y - node.r - 10 + "px";
            tooltip.style.opacity = "1";
          }
        } else {
          tooltip.style.opacity = "0";
        }
      }

      stateRef.current.raf = requestAnimationFrame(step);
    }
    step();

    return () => {
      cancelAnimationFrame(stateRef.current?.raf);
      clearInterval(spawnTimer);
      clearInterval(pulseTimer);
      clearInterval(highlightTimer);
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "220px",
        cursor: "default",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          transform: "translate(-50%, -100%)",
          padding: "4px 9px",
          borderRadius: "6px",
          background: "#18181B",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F8FAFC",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "Inter,sans-serif",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.12s",
          zIndex: 5,
        }}
      />
    </div>
  );
}

function CTA({ onOpen }) {
  return (
    <div style={{ padding: "96px 32px" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#0B0B0D",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT — the network visualization, square-ish, tells the story */}
        <div
          style={{
            flex: "0 0 auto",
            width: "320px",
            minHeight: "320px",
            background:
              "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <NetworkViz />
          </div>
          {/* Tiny static caption — confirms the metaphor at a glance */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              padding: "10px 12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "3px",
                  background: "#818CF8",
                }}
              />
              <span
                style={{
                  color: "#7C8294",
                  fontSize: "11px",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Room
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#E4E4E7",
                }}
              />
              <span
                style={{
                  color: "#7C8294",
                  fontSize: "11px",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Collaborators
              </span>
            </span>
          </div>
        </div>

        {/* RIGHT — copy + buttons */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            textAlign: "left",
            padding: "clamp(36px,5vw,52px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 16px', borderRadius: '999px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '18px', alignSelf: 'flex-start' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#818CF8', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#A5B4FC', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ready when you are</span>
          </div> */}

          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              color: "#F8FAFC",
              marginBottom: "14px",
            }}
          >
            Open a room.
            <br />
            Start coding together.
          </h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: "15.5px",
              lineHeight: 1.7,
              maxWidth: "380px",
              marginBottom: "30px",
            }}
          >
            No account. No setup. Share a 6-character code and your team shows
            up — live, like this.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="ce-btn-primary"
              onClick={onOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 30px",
                background: "#6366F1",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              <Ico.Bolt s={15} c="#fff" /> Create a room — it's free
            </button>
            <a
              href="https://github.com/user1-prajwal/collab-editor"
              target="_blank"
              rel="noreferrer"
              className="ce-btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#9CA3AF",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Ico.Github s={15} /> Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER 
function Footer({ onOpen }) {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 32px 28px",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "36px",
            marginBottom: "36px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  background: "#6366F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico.Bolt s={12} c="#fff" />
              </div>
              <span
                style={{ fontWeight: 700, fontSize: "14px", color: "#F8FAFC" }}
              >
                Collab Editor
              </span>
            </div>
            <p
              style={{
                color: "#374151",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: "14px",
              }}
            >
              Free, open-source real-time collaborative code editor.
            </p>
            <div style={{ display: "flex", gap: "7px" }}>
              {[
                { href: "https://github.com/user1-prajwal", Ic: Ico.Github },
                {
                  href: "https://www.linkedin.com/in/user1-prajwal451/",
                  Ic: Ico.In,
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ce-social"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "7px",
                    background: "#18181B",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6B7280",
                    textDecoration: "none",
                  }}
                >
                  <s.Ic s={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4
              style={{
                color: "#F8FAFC",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Features
            </h4>
            {[
              "Real-time sync",
              "Live cursors",
              "Code execution",
              "Built-in chat",
              "Multi-file",
              "Import & Export",
            ].map((f) => (
              <div
                key={f}
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}
              >
                {f}
              </div>
            ))}
          </div>

          {/* Languages */}
          <div>
            <h4
              style={{
                color: "#F8FAFC",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Languages
            </h4>
            {["JavaScript", "TypeScript", "Python", "Java", "C++"].map((l) => (
              <div
                key={l}
                style={{
                  color: "#374151",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}
              >
                {l}
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                color: "#F8FAFC",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Links
            </h4>
            <button
              onClick={onOpen}
              style={{
                display: "block",
                background: "none",
                border: "none",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
                padding: 0,
                marginBottom: "8px",
                fontFamily: "Inter,sans-serif",
                textAlign: "left",
              }}
            >
              Create Room
            </button>
            {[
              {
                href: "https://github.com/user1-prajwal/collab-editor",
                label: "GitHub",
              },
              {
                href: "https://github.com/user1-prajwal/collab-editor/issues",
                label: "Report a Bug",
              },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  color: "#374151",
                  fontSize: "13px",
                  textDecoration: "none",
                  marginBottom: "8px",
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#F8FAFC")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span style={{ color: "#374151", fontSize: "12px" }}>
            © 2025 Collab Editor · Free forever · No data stored · MIT License
          </span>
          <span style={{ color: "#374151", fontSize: "12px" }}>
            React + Socket.io + Monaco Editor
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT
export default function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    injectGlobal();
  }, []);

  function createRoom() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${id}`);
  }

  return (
    <div
      style={{
        background: "#09090B",
        color: "#F8FAFC",
        minHeight: "100vh",
        fontFamily: "Inter,system-ui,sans-serif",
      }}
    >
      <Navbar onOpen={createRoom} />
      <Hero onOpen={createRoom} />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA onOpen={createRoom} />
      <Footer onOpen={createRoom} />
    </div>
  );
}

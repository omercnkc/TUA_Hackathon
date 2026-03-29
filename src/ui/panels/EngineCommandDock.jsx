import React from "react";

function formatCountdown(value, state) {
  if (state !== "countdown") {
    return "0.0";
  }

  const safeValue = Math.max(0, Number(value) || 0);
  return safeValue.toFixed(1);
}

function statusTone(status) {
  switch (status) {
    case "launch":
      return { label: "LAUNCH", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.45)" };
    case "burnout":
      return { label: "BURNOUT", color: "#facc15", glow: "rgba(250, 204, 21, 0.4)" };
    case "landed":
      return { label: "LANDED", color: "#c084fc", glow: "rgba(192, 132, 252, 0.38)" };
    case "countdown":
      return { label: "COUNTDOWN", color: "#4ade80", glow: "rgba(74, 222, 128, 0.38)" };
    default:
      return { label: "IDLE", color: "#e5e7eb", glow: "rgba(229, 231, 235, 0.24)" };
  }
}

function Metric({ label, value, unit, accent }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "rgba(182, 215, 224, 0.68)"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: accent || "#e6fbff"
        }}
      >
        {value}
        {unit && (
          <span style={{ marginLeft: 6, fontSize: 12, color: "rgba(182, 215, 224, 0.75)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EngineCommandDock({ sim }) {
  const { state, startCountdown, resetSimulation, clearSession } = sim;
  const tone = statusTone(state.state);
  const ignitionDisabled = state.state !== "idle" && state.state !== "landed";

  return (
    <aside
      style={{
        position: "absolute",
        left: 24,
        bottom: 24,
        width: "min(420px, calc(100vw - 48px))",
        padding: 18,
        border: "1px solid rgba(34, 211, 238, 0.24)",
        background: "linear-gradient(135deg, rgba(5, 14, 24, 0.8), rgba(11, 24, 37, 0.56))",
        backdropFilter: "blur(14px)",
        boxShadow: "0 22px 50px rgba(0,0,0,0.32)",
        overflow: "hidden",
        zIndex: 20
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 10, left: 10, width: 44, height: 44, borderTop: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee", opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 44, height: 44, borderBottom: "2px solid #22d3ee", borderRight: "2px solid #22d3ee", opacity: 0.7 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, marginBottom: 16 }}>
          <div>
            <div
              style={{
                marginBottom: 6,
                color: "#22d3ee",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.2em"
              }}
            >
              Tactical Launch Command
            </div>
            <div style={{ color: "#dff7ff", fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Sys.Op: Base Alpha // Engine Link Active
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={clearSession}
              style={{
                width: 40,
                height: 40,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(34, 211, 238, 0.36)",
                background: "rgba(10, 18, 30, 0.62)",
                color: "#67e8f9",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
                boxShadow: "inset 0 0 14px rgba(34, 211, 238, 0.08)"
              }}
              title="Tam sifirla"
              aria-label="Tam sifirla"
            >
              ↺
            </button>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "rgba(10, 18, 30, 0.55)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: tone.color,
                  boxShadow: `0 0 12px ${tone.glow}`
                }}
              />
              <span style={{ color: "#f3fbff", fontSize: 12, letterSpacing: "0.16em", fontWeight: 700 }}>
                {tone.label}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 14,
            borderTop: "1px dashed rgba(34, 211, 238, 0.25)",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 18
          }}
        >
          <Metric label="Altitude" value={state.height.toFixed(0)} unit="m" />
          <Metric label="Velocity" value={state.velocity.toFixed(1)} unit="m/s" />
          <Metric label="Fuel Level" value={state.fuel.toFixed(0)} unit="%" accent={state.fuel < 20 ? "#f87171" : "#e6fbff"} />
          <Metric
            label="T-Minus"
            value={formatCountdown(state.countdown, state.state)}
            accent={state.state === "countdown" ? "#4ade80" : "#22d3ee"}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={startCountdown}
            disabled={ignitionDisabled}
            style={{
              flex: 1,
              padding: "13px 16px",
              border: "1px solid rgba(34, 211, 238, 0.9)",
              background: ignitionDisabled ? "rgba(34, 211, 238, 0.12)" : "rgba(34, 211, 238, 0.14)",
              color: ignitionDisabled ? "rgba(172, 224, 232, 0.58)" : "#5cf2ff",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              cursor: ignitionDisabled ? "not-allowed" : "pointer",
              boxShadow: ignitionDisabled ? "none" : "inset 0 0 18px rgba(34, 211, 238, 0.12), 0 0 20px rgba(34, 211, 238, 0.16)"
            }}
          >
            IGNITION
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            style={{
              flex: 1,
              padding: "13px 16px",
              border: "1px solid rgba(248, 113, 113, 0.5)",
              background: "rgba(127, 29, 29, 0.14)",
              color: "#fda4af",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              cursor: "pointer"
            }}
          >
            ABORT
          </button>
        </div>
      </div>
    </aside>
  );
}

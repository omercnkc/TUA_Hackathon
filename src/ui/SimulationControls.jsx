import React from "react";

export default function SimulationControls({
  isPaused,
  simulationSpeed,
  onTogglePause,
  onStepOnce,
  onChangeSpeed
}) {
  return (
    <div style={{ margin: "16px", padding: "16px", border: "1px solid #444", borderRadius: "8px", background: "rgba(30, 30, 30, 0.8)", backdropFilter: "blur(4px)" }}>
      <h3 style={{ marginTop: 0 }}>Simulation Engine Controls</h3>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button 
          onClick={onTogglePause}
          style={{ 
            padding: "8px 16px", 
            background: isPaused ? "#28a745" : "#ffc107", 
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "100px"
          }}
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button 
          onClick={onStepOnce}
          disabled={!isPaused}
          style={{ 
            padding: "8px 16px", 
            background: "#17a2b8", 
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isPaused ? "pointer" : "not-allowed",
            opacity: isPaused ? 1 : 0.5
          }}
        >
          ⏭ Step Once
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Simulation Speed:</label>
        <select
          value={simulationSpeed}
          onChange={(e) => onChangeSpeed(Number(e.target.value))}
          style={{ 
            padding: "6px 10px", 
            background: "#333", 
            color: "#fff", 
            border: "1px solid #555",
            borderRadius: "4px"
          }}
        >
          <option value={0.1}>0.1x (Slowmo)</option>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x (Realtime)</option>
          <option value={2}>2x</option>
          <option value={5}>5x (Fast)</option>
          <option value={10}>10x (Turbo)</option>
        </select>
      </div>
    </div>
  );
}

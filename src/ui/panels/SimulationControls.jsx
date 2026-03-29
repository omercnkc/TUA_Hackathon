import React from "react";

export default function SimulationControls({
  isPaused,
  simulationSpeed,
  onTogglePause,
  onStepOnce,
  onChangeSpeed
}) {
  return (
    <div className="surface-card">
      <h3 className="surface-title">Simulation Engine Controls</h3>
      <p className="surface-subtitle">
        Tune cadence and pause behavior without leaving the mission console.
      </p>

      <div className="status-pill-row">
        <div className="status-pill">State: <strong>{isPaused ? "Paused" : "Running"}</strong></div>
        <div className="status-pill">Speed: <strong>{simulationSpeed}x</strong></div>
      </div>

      <div className="control-actions">
        <button className={`control-button ${isPaused ? "primary" : ""}`} onClick={onTogglePause}>
          {isPaused ? "Resume Simulation" : "Pause Simulation"}
        </button>
        <button className="control-button" onClick={onStepOnce} disabled={!isPaused}>
          Advance One Frame
        </button>
      </div>

      <div className="field">
        <label className="field-label">Simulation Speed</label>
        <select value={simulationSpeed} onChange={(e) => onChangeSpeed(Number(e.target.value))}>
          <option value={0.1}>0.1x Slow Motion</option>
          <option value={0.5}>0.5x Reduced</option>
          <option value={1}>1x Realtime</option>
          <option value={2}>2x Accelerated</option>
          <option value={5}>5x Fast</option>
          <option value={10}>10x Turbo</option>
        </select>
      </div>
    </div>
  );
}

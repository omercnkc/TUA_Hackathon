import React from "react";
import { convertHistoryToCSV, downloadCSV } from "../../engine/simulation/export/csvExport";

const statusClass = (state) => {
  switch (state) {
    case "countdown": return "badge badge-countdown";
    case "launch": return "badge badge-launch";
    case "burnout": return "badge badge-burnout";
    case "landed": return "badge badge-landing";
    default: return "badge badge-idle";
  }
};

export default function TopBar({ sim }) {
  const { state, startCountdown, resetSimulation, clearRunHistory, clearSession, history } = sim;

  const handleExportCSV = () => {
    const csv = convertHistoryToCSV(history || []);
    downloadCSV("flight-history.csv", csv);
  };

  const connectionLabel = sim.connection.engineConnected ? "ENGINE LINKED" : "ENGINE OFFLINE";
  const transportLabel = sim.transportType === "none" ? "LOCAL" : sim.transportType.toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className={statusClass(state.state)}>{state.state.toUpperCase()}</div>
        <div style={{ fontWeight: 700, letterSpacing: "0.08em" }}>Rocket Flight Simulation</div>
        <div style={{ opacity: 0.72, fontSize: 12 }}>
          {sim.hostRole.toUpperCase()} / {transportLabel} / {connectionLabel}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary" onClick={startCountdown}>Start Countdown</button>
        <button className="btn" onClick={resetSimulation}>Reset</button>
        <button className="btn" onClick={handleExportCSV}>Export CSV</button>
        <button className="btn" onClick={clearRunHistory}>Clear Runs</button>
        <button className="btn btn-danger" onClick={clearSession}>Clear Session</button>
      </div>
    </div>
  );
}

import React from "react";

export default function ScenarioResult({ result }) {
  if (!result) {
    return (
      <div className="surface-card">
        <h3 className="surface-title">Scenario Result</h3>
        <p className="surface-subtitle">No scenario result yet.</p>
      </div>
    );
  }

  const borderColor = result.success ? "rgba(126,247,184,0.45)" : "rgba(255,140,150,0.45)";
  const statusColor = result.success ? "#7ef7b8" : "#ff8c96";
  const statusText = result.success ? "Mission Success" : "Mission Failed";

  return (
    <div className="surface-card" style={{ borderColor }}>
      <h3 className="surface-title">Scenario Result</h3>
      <div className="compare-columns">
        <div className="compare-run-card">
          <div className="metric-label">Scenario</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{result.scenarioName}</div>
          <div style={{ color: statusColor, marginTop: 10, fontWeight: 700 }}>{statusText}</div>
        </div>
        <div className="compare-run-card">
          <div className="metric-label">Overall Score</div>
          <div className="metric-value" style={{ color: "#ffd580" }}>{result.score?.toFixed(1)}</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 8 }}>{result.rating}</div>
        </div>
      </div>

      {result.breakdown && (
        <div className="delta-grid">
          <div className="delta-card"><span className="metric-label">Altitude</span>{result.breakdown.altitudeScore.toFixed(0)}%</div>
          <div className="delta-card"><span className="metric-label">Fuel Efficiency</span>{result.breakdown.fuelEfficiencyScore.toFixed(0)}%</div>
          <div className="delta-card"><span className="metric-label">Landing</span>{result.breakdown.landingScore.toFixed(0)}%</div>
          <div className="delta-card"><span className="metric-label">Stability</span>{result.breakdown.velocityControlScore.toFixed(0)}%</div>
        </div>
      )}

      <div className="chart-card">
        <div className="chart-title">Evaluation Summary</div>
        <div className="timeline-list">
          {result.reasons.map((reason, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-type">Reason</div>
              <div className="timeline-meta" style={{ gridColumn: "2 / 4" }}>{reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

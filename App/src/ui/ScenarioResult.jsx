import React from "react";

export default function ScenarioResult({ result }) {
  if (!result) {
    return (
      <div style={{ margin: "16px", padding: "16px", border: "1px solid #ccc" }}>
        <h3>Scenario Result</h3>
        <div>No scenario result yet.</div>
      </div>
    );
  }

  const borderColor = result.success ? "#51cf66" : "#ff6b6b";
  const statusColor = result.success ? "#51cf66" : "#ff6b6b";
  const statusText = result.success ? "✅ MISSION SUCCESS" : "❌ MISSION FAILED";

  return (
    <div style={{
      margin: "16px",
      padding: "16px",
      border: `2px solid ${borderColor}`,
      borderRadius: "8px",
      background: "rgba(30, 30, 30, 0.5)",
      backdropFilter: "blur(4px)"
    }}>
      <h3 style={{ marginTop: 0 }}>Scenario Result</h3>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div><strong>Scenario:</strong> {result.scenarioName}</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: statusColor, marginTop: "8px" }}>
            {statusText}
          </div>
        </div>
        
        <div style={{ textAlign: "right", padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", minWidth: "120px" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffd43b" }}>{result.score?.toFixed(1)}</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>OVERALL SCORE</div>
          <div style={{ fontSize: "32px", fontWeight: "black", color: "#fff", marginTop: "5px" }}>{result.rating}</div>
        </div>
      </div>

      {result.breakdown && (
        <div style={{ 
          marginTop: "16px", 
          padding: "12px", 
          background: "rgba(255,255,255,0.05)", 
          borderRadius: "6px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px"
        }}>
          <div><small style={{opacity: 0.7}}>Altitude:</small> <strong>{result.breakdown.altitudeScore.toFixed(0)}%</strong></div>
          <div><small style={{opacity: 0.7}}>Fuel Efficiency:</small> <strong>{result.breakdown.fuelEfficiencyScore.toFixed(0)}%</strong></div>
          <div><small style={{opacity: 0.7}}>Landing:</small> <strong>{result.breakdown.landingScore.toFixed(0)}%</strong></div>
          <div><small style={{opacity: 0.7}}>Stability:</small> <strong>{result.breakdown.velocityControlScore.toFixed(0)}%</strong></div>
        </div>
      )}

      <div style={{ marginTop: "16px" }}>
        <strong>Evaluation Summary</strong>
        {result.reasons.map((reason, index) => (
          <div key={index} style={{ marginTop: "4px", fontSize: "14px", opacity: 0.9 }}>{reason}</div>
        ))}
      </div>
    </div>
  );
}

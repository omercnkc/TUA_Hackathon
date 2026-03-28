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
      borderRadius: "4px"
    }}>
      <h3>Scenario Result</h3>
      <div><strong>Scenario:</strong> {result.scenarioName}</div>
      <div style={{ fontSize: "18px", fontWeight: "bold", color: statusColor, marginTop: "8px" }}>
        {statusText}
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Evaluation</strong>
        {result.reasons.map((reason, index) => (
          <div key={index} style={{ marginTop: "4px" }}>{reason}</div>
        ))}
      </div>
    </div>
  );
}

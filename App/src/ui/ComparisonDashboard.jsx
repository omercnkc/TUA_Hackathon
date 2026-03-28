import React from "react";
import { compareRuns } from "../simulation/comparison/compareRuns";

function formatDiff(value, unit) {
  const sign = value > 0 ? "+" : "";
  const color = value > 0 ? "#51cf66" : value < 0 ? "#ff6b6b" : "#aaa";
  return (
    <span style={{ color, fontWeight: "bold" }}>
      {sign}{value.toFixed(2)} {unit}
    </span>
  );
}

export default function ComparisonDashboard({ runs }) {
  if (!runs || runs.length < 2) {
    return (
      <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc" }}>
        <h3>Run Comparison</h3>
        <div>At least two completed runs are required for comparison.</div>
        {runs && runs.length === 1 && (
          <div style={{ marginTop: "8px", color: "#aaa" }}>
            1 run completed. Complete another flight to see comparison.
          </div>
        )}
      </div>
    );
  }

  const previousRun = runs[runs.length - 2];
  const currentRun = runs[runs.length - 1];

  const comparison = compareRuns(previousRun, currentRun);

  if (!comparison) {
    return (
      <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc" }}>
        <h3>Run Comparison</h3>
        <div>Comparison data is unavailable.</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc" }}>
      <h3>Run Comparison ({runs.length} runs total)</h3>

      <div style={{ display: "flex", gap: "32px", marginTop: "12px" }}>
        <div>
          <strong>Previous Run</strong>
          <div style={{ fontSize: "11px", color: "#888" }}>{previousRun.createdAt}</div>
          <div>Height: {previousRun.analysis?.maxHeight?.toFixed(2) ?? "—"} m</div>
          <div>Velocity: {previousRun.analysis?.maxVelocity?.toFixed(2) ?? "—"} m/s</div>
          <div>Time: {previousRun.analysis?.flightTime?.toFixed(2) ?? "—"} s</div>
        </div>

        <div>
          <strong>Current Run</strong>
          <div style={{ fontSize: "11px", color: "#888" }}>{currentRun.createdAt}</div>
          <div>Height: {currentRun.analysis?.maxHeight?.toFixed(2) ?? "—"} m</div>
          <div>Velocity: {currentRun.analysis?.maxVelocity?.toFixed(2) ?? "—"} m/s</div>
          <div>Time: {currentRun.analysis?.flightTime?.toFixed(2) ?? "—"} s</div>
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <h4>Differences</h4>
        <div>Max Height: {formatDiff(comparison.maxHeightDiff, "m")}</div>
        <div>Max Velocity: {formatDiff(comparison.maxVelocityDiff, "m/s")}</div>
        <div>Flight Time: {formatDiff(comparison.flightTimeDiff, "s")}</div>
      </div>
    </div>
  );
}

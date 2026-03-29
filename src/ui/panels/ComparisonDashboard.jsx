import React from "react";
import { compareRuns } from "../../engine/simulation/comparison/compareRuns";
import ComparisonChart from "./ComparisonChart";

function formatDiff(value, unit) {
  const sign = value > 0 ? "+" : "";
  const color = value > 0 ? "#7ef7b8" : value < 0 ? "#ff8c96" : "#8aa0c2";
  return <span style={{ color, fontWeight: 700 }}>{sign}{value.toFixed(2)} {unit}</span>;
}

function formatDate(value) {
  if (!value) return "Unknown run";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function ComparisonDashboard({ runs }) {
  if (!runs || runs.length < 2) {
    return (
      <div className="surface-card">
        <h3 className="surface-title">Run Comparison</h3>
        <p className="surface-subtitle">Complete at least two missions to unlock trend comparison cards and charts.</p>
      </div>
    );
  }

  const previousRun = runs[runs.length - 2];
  const currentRun = runs[runs.length - 1];
  const comparison = compareRuns(previousRun, currentRun);

  if (!comparison) {
    return (
      <div className="surface-card">
        <h3 className="surface-title">Run Comparison</h3>
        <p className="surface-subtitle">Comparison data is unavailable for the latest pair of missions.</p>
      </div>
    );
  }

  const prevScore = previousRun.scenarioResult?.score ?? 0;
  const currScore = currentRun.scenarioResult?.score ?? 0;
  const scoreDiff = currScore - prevScore;

  return (
    <div className="surface-card">
      <h3 className="surface-title">Run Comparison</h3>
      <p className="surface-subtitle">Side-by-side mission deltas with trend charts for the latest completed flights.</p>

      <div className="compare-columns">
        <div className="compare-run-card">
          <div className="metric-label">Previous Run</div>
          <div className="compare-run-time">{formatDate(previousRun.createdAt)}</div>
          <div>Height: {previousRun.analysis?.maxHeight?.toFixed(2) ?? "—"} m</div>
          <div>Velocity: {previousRun.analysis?.maxVelocity?.toFixed(2) ?? "—"} m/s</div>
          <div>Rating: {previousRun.scenarioResult?.rating ?? "—"}</div>
          <div>Score: {prevScore.toFixed(1)}</div>
        </div>

        <div className="compare-run-card">
          <div className="metric-label">Current Run</div>
          <div className="compare-run-time">{formatDate(currentRun.createdAt)}</div>
          <div>Height: {currentRun.analysis?.maxHeight?.toFixed(2) ?? "—"} m</div>
          <div>Velocity: {currentRun.analysis?.maxVelocity?.toFixed(2) ?? "—"} m/s</div>
          <div>Rating: {currentRun.scenarioResult?.rating ?? "—"}</div>
          <div>Score: {currScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="delta-grid">
        <div className="delta-card">
          <span className="metric-label">Max Height Delta</span>
          <div>{formatDiff(comparison.maxHeightDiff, "m")}</div>
        </div>
        <div className="delta-card">
          <span className="metric-label">Max Velocity Delta</span>
          <div>{formatDiff(comparison.maxVelocityDiff, "m/s")}</div>
        </div>
        <div className="delta-card">
          <span className="metric-label">Score Delta</span>
          <div>{formatDiff(scoreDiff, "pts")}</div>
        </div>
      </div>

      <ComparisonChart runA={previousRun} runB={currentRun} dataKey="height" title="Height Comparison" />
      <ComparisonChart runA={previousRun} runB={currentRun} dataKey="velocity" title="Velocity Comparison" />
    </div>
  );
}

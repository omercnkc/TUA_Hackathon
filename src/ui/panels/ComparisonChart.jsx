import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function ComparisonChart({
  runA,
  runB,
  dataKey,
  title
}) {
  if (!runA || !runB) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">{title}</h3>
        <div className="surface-subtitle" style={{ marginBottom: 0 }}>Not enough runs to compare.</div>
      </div>
    );
  }

  const dataA = runA.history || [];
  const dataB = runB.history || [];
  const combinedData = [];
  const maxLength = Math.max(dataA.length, dataB.length);

  for (let i = 0; i < maxLength; i += 1) {
    combinedData.push({
      time: dataA[i]?.time ?? dataB[i]?.time,
      valueA: dataA[i]?.[dataKey] ?? null,
      valueB: dataB[i]?.[dataKey] ?? null
    });
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={combinedData} margin={{ top: 10, right: 16, left: 0, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(138,160,194,0.15)" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              stroke="#8aa0c2"
              label={{ value: "Time (s)", position: "insideBottomRight", offset: -6, fill: "#8aa0c2" }}
            />
            <YAxis stroke="#8aa0c2" label={{ value: dataKey, angle: -90, position: "insideLeft", fill: "#8aa0c2" }} />
            <Tooltip
              contentStyle={{
                background: "rgba(11, 22, 36, 0.96)",
                border: "1px solid rgba(138,160,194,0.16)",
                borderRadius: "12px",
                color: "#e5f0ff"
              }}
              labelFormatter={(v) => `Time: ${v}s`}
              formatter={(value, name) => [
                value == null ? "—" : Number(value).toFixed(2),
                name === "valueA" ? "Previous Run" : "Current Run"
              ]}
            />
            <Legend formatter={(value) => value === "valueA" ? "Previous Run" : "Current Run"} />

            <Line type="monotone" dataKey="valueA" stroke="#55b7ff" dot={false} strokeWidth={2.3} connectNulls isAnimationActive={false} />
            <Line type="monotone" dataKey="valueB" stroke="#ff7b6b" dot={false} strokeWidth={2.3} connectNulls isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

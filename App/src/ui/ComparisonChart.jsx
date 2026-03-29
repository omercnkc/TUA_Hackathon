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
      <div style={{ marginTop: "16px" }}>
        <h3>{title}</h3>
        <div>Not enough runs to compare.</div>
      </div>
    );
  }

  const dataA = runA.history || [];
  const dataB = runB.history || [];

  const combinedData = [];
  const maxLength = Math.max(dataA.length, dataB.length);

  for (let i = 0; i < maxLength; i++) {
    combinedData.push({
      time: dataA[i]?.time ?? dataB[i]?.time,
      valueA: dataA[i]?.[dataKey] ?? null,
      valueB: dataB[i]?.[dataKey] ?? null
    });
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={combinedData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={['auto', 'auto']}
              label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              label={{ value: dataKey, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              labelFormatter={(v) => `Time: ${v}s`}
              formatter={(value, name) => [
                value?.toFixed(2) ?? "—",
                name === "valueA" ? "Run A (Previous)" : "Run B (Current)"
              ]}
            />
            <Legend
              formatter={(value) => value === "valueA" ? "Run A (Previous)" : "Run B (Current)"}
            />

            <Line
              type="monotone"
              dataKey="valueA"
              stroke="#8884d8"
              dot={false}
              strokeWidth={2}
              name="valueA"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="valueB"
              stroke="#ff4d4f"
              dot={false}
              strokeWidth={2}
              name="valueB"
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

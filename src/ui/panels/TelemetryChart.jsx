import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

function mapEventsToChartData(data, events, dataKey) {
  if (!data || !events || data.length === 0) return [];

  return events
    .map((event) => {
      if (!event.time) return null;

      let closestPoint = null;
      let minDiff = Infinity;

      for (const point of data) {
        const diff = Math.abs(point.time - event.time);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = point;
        }
      }

      if (!closestPoint || closestPoint[dataKey] === undefined) return null;

      return {
        type: event.type,
        time: closestPoint.time,
        value: closestPoint[dataKey]
      };
    })
    .filter(Boolean);
}

export default function TelemetryChart({
  data,
  dataKey,
  title,
  events = [],
  color = "#8884d8"
}) {
  const chartEvents = useMemo(() => mapEventsToChartData(data, events, dataKey), [data, events, dataKey]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">{title}</h3>
        <div className="surface-subtitle" style={{ marginBottom: 0 }}>No telemetry data yet.</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(138,160,194,0.15)" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["auto", "auto"]}
              stroke="#8aa0c2"
              label={{ value: "Time (s)", position: "insideBottomRight", offset: -6, fill: "#8aa0c2" }}
            />
            <YAxis
              stroke="#8aa0c2"
              label={{ value: dataKey, angle: -90, position: "insideLeft", fill: "#8aa0c2" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(11, 22, 36, 0.96)",
                border: "1px solid rgba(138,160,194,0.16)",
                borderRadius: "12px",
                color: "#e5f0ff"
              }}
              labelFormatter={(value) => `Time: ${value}s`}
              formatter={(value) => [Number(value).toFixed(2), dataKey]}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2.4} isAnimationActive={false} />

            {chartEvents.map((ev, idx) => (
              <ReferenceDot
                key={`${ev.type}-${ev.time}-${idx}`}
                x={ev.time}
                y={ev.value}
                r={5}
                fill="#ff5d73"
                stroke="#ffffff"
                strokeWidth={2}
                label={{
                  value: ev.type.toUpperCase(),
                  position: "top",
                  fill: "#ff5d73",
                  fontSize: 10,
                  fontWeight: "bold"
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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

// Helper: Veri içindeki event zamanına en yakın noktayı bulup chart koordinatlarını belirler
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
  const chartEvents = useMemo(() => {
    return mapEventsToChartData(data, events, dataKey);
  }, [data, events, dataKey]);

  if (!data || data.length === 0) {
    return (
      <div style={{ marginTop: "16px" }}>
        <h3>{title}</h3>
        <div style={{ padding: '20px', border: '1px dashed #ccc' }}>No telemetry data yet.</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              labelFormatter={(value) => `Time: ${value}s`}
              formatter={(value) => [value.toFixed(2), dataKey]}
            />
            
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />

            {chartEvents.map((ev, idx) => (
              <ReferenceDot
                key={`${ev.type}-${ev.time}-${idx}`}
                x={ev.time}
                y={ev.value}
                r={5}
                fill="#ff0000"
                stroke="#fff"
                strokeWidth={2}
                label={{ 
                  value: ev.type.toUpperCase(), 
                  position: 'top', 
                  fill: '#ff0000', 
                  fontSize: 10,
                  fontWeight: 'bold'
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
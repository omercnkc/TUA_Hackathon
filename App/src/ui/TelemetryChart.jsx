import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TelemetryChart({
  data,
  dataKey,
  title,
  color = "#8884d8"
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ marginTop: "16px" }}>
        <h3>{title}</h3>
        <div>No telemetry data yet.</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
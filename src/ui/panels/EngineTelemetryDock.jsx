import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function Metric({ label, value, unit }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(6, 15, 28, 0.76)",
        border: "1px solid rgba(138,160,194,0.16)"
      }}
    >
      <div style={{ fontSize: 11, color: "#8aa0c2", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: "#e5f0ff" }}>
        {value}
        {unit && <span style={{ fontSize: 12, color: "#8aa0c2", marginLeft: 6 }}>{unit}</span>}
      </div>
    </div>
  );
}

function MiniChart({ title, data, dataKey, color }) {
  const compactData = useMemo(() => data.slice(-140), [data]);

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 16,
        background: "rgba(6, 15, 28, 0.72)",
        border: "1px solid rgba(138,160,194,0.14)"
      }}
    >
      <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 700, color: "#dce8ff" }}>{title}</div>
      <div style={{ width: "100%", height: 130 }}>
        <ResponsiveContainer>
          <LineChart data={compactData} margin={{ top: 6, right: 8, left: -18, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(138,160,194,0.12)" />
            <XAxis dataKey="time" tick={{ fill: "#7f94b7", fontSize: 10 }} stroke="rgba(138,160,194,0.18)" />
            <YAxis tick={{ fill: "#7f94b7", fontSize: 10 }} stroke="rgba(138,160,194,0.18)" width={34} />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 17, 29, 0.96)",
                border: "1px solid rgba(138,160,194,0.16)",
                borderRadius: 12,
                color: "#e5f0ff"
              }}
              labelFormatter={(value) => `T+ ${value}s`}
              formatter={(value) => [Number(value).toFixed(2), title]}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2.2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function EngineTelemetryDock({ sim }) {
  const { state, history, analysis } = sim;

  return (
    <aside
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        width: 340,
        maxHeight: "calc(100vh - 48px)",
        overflow: "auto",
        padding: 16,
        borderRadius: 20,
        background: "linear-gradient(180deg, rgba(8, 16, 28, 0.78), rgba(4, 10, 20, 0.68))",
        border: "1px solid rgba(138,160,194,0.16)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.32)"
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#00e5ff", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          Engine Telemetry
        </div>
        <div style={{ color: "#e5f0ff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Live Flight Data</div>
        <div style={{ color: "#8aa0c2", fontSize: 13, lineHeight: 1.5 }}>
          Compact chart overlay for the engine viewport. Values stay visible without blocking the vehicle silhouette.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10, marginBottom: 12 }}>
        <Metric label="Altitude" value={state.height.toFixed(0)} unit="m" />
        <Metric label="Velocity" value={state.velocity.toFixed(1)} unit="m/s" />
        <Metric label="Fuel" value={state.fuel.toFixed(0)} unit="%" />
        <Metric label="Thrust" value={(state.currentThrust || 0).toFixed(0)} unit="N" />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <MiniChart title="Altitude Trend" data={history} dataKey="height" color="#34d5ff" />
        <MiniChart title="Velocity Trend" data={history} dataKey="velocity" color="#8ef0b1" />
        <MiniChart title="Fuel Trend" data={history} dataKey="fuel" color="#ffb347" />
      </div>

      {analysis && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 14px",
            borderRadius: 16,
            background: "rgba(6, 15, 28, 0.72)",
            border: "1px solid rgba(138,160,194,0.14)"
          }}
        >
          <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 700, color: "#dce8ff" }}>Mission Snapshot</div>
          <div style={{ color: "#8aa0c2", fontSize: 12, lineHeight: 1.8 }}>
            Max height: <strong style={{ color: "#e5f0ff" }}>{analysis.maxHeight.toFixed(0)} m</strong><br />
            Max velocity: <strong style={{ color: "#e5f0ff" }}>{analysis.maxVelocity.toFixed(1)} m/s</strong><br />
            Flight time: <strong style={{ color: "#e5f0ff" }}>{analysis.flightTime.toFixed(1)} s</strong><br />
            Status: <strong style={{ color: "#e5f0ff" }}>{state.state.toUpperCase()}</strong>
          </div>
        </div>
      )}
    </aside>
  );
}

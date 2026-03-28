import React from "react";
import TelemetryChart from "./TelemetryChart";

export default function FlightDashboard({ state, analysis, history }) {
  return (
    <div style={{ padding: "16px", maxWidth: "900px" }}>
      <h2>Flight Dashboard</h2>

      <div style={{ marginBottom: "16px" }}>
        <div>State: {state.state}</div>
        <div>Countdown: {state.countdown.toFixed(1)}</div>
        <div>Height: {state.height.toFixed(2)} m</div>
        <div>Velocity: {state.velocity.toFixed(2)} m/s</div>
        <div>Acceleration: {state.acceleration.toFixed(2)} m/s²</div>
        <div>Fuel: {state.fuel.toFixed(2)}</div>
        <div>Time: {state.time.toFixed(2)} s</div>
      </div>

      {analysis && (
        <div style={{ marginBottom: "16px" }}>
          <h3>Flight Analysis</h3>
          <div>Max Height: {analysis.maxHeight.toFixed(2)} m</div>
          <div>Max Velocity: {analysis.maxVelocity.toFixed(2)} m/s</div>
          <div>Total Flight Time: {analysis.flightTime.toFixed(2)} s</div>
        </div>
      )}

      {state.events && state.events.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h3>Flight Events</h3>
          {state.events.map((e, i) => (
            <div key={i}>
              {e.type.toUpperCase()} — t={e.time.toFixed(2)}s — h={e.height.toFixed(2)}m
            </div>
          ))}
        </div>
      )}

      <TelemetryChart
        data={history}
        dataKey="height"
        title="Height vs Time"
        events={state.events}
      />

      <TelemetryChart
        data={history}
        dataKey="velocity"
        title="Velocity vs Time"
        color="#82ca9d"
        events={state.events}
      />

      <TelemetryChart
        data={history}
        dataKey="fuel"
        title="Fuel vs Time"
        color="#ff7300"
        events={state.events}
      />
    </div>
  );
}
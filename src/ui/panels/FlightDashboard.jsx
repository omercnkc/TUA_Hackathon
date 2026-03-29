import React from "react";
import TelemetryChart from "./TelemetryChart";

function StatCard({ label, value, unit = "" }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <div className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default function FlightDashboard({ state, analysis, history, events = [] }) {
  return (
    <div className="surface-card">
      <h2 className="surface-title">Flight Dashboard</h2>
      <p className="surface-subtitle">
        Live mission telemetry, propulsion state, and post-flight performance indicators in one place.
      </p>

      <div className="status-pill-row">
        <div className="status-pill">Flight state: <strong>{state.state}</strong></div>
        <div className="status-pill">Countdown: <strong>{state.countdown.toFixed(1)}s</strong></div>
        <div className="status-pill">Simulation: <strong>{state.simulationSpeed}x</strong></div>
      </div>

      <div className="metric-grid metric-grid-3">
        <StatCard label="Altitude" value={state.height.toFixed(0)} unit="m" />
        <StatCard label="Velocity" value={state.velocity.toFixed(1)} unit="m/s" />
        <StatCard label="Acceleration" value={state.acceleration.toFixed(1)} unit="m/s²" />
        <StatCard label="Fuel" value={state.fuel.toFixed(0)} unit="%" />
        <StatCard label="Total Mass" value={(state.totalMass || 0).toFixed(0)} unit="kg" />
        <StatCard label="Current Thrust" value={(state.currentThrust || 0).toFixed(0)} unit="N" />
      </div>

      {analysis && (
        <div className="surface-card" style={{ marginTop: 16, padding: 14 }}>
          <div className="metric-grid metric-grid-3">
            <StatCard label="Max Height" value={analysis.maxHeight.toFixed(0)} unit="m" />
            <StatCard label="Max Velocity" value={analysis.maxVelocity.toFixed(1)} unit="m/s" />
            <StatCard label="Flight Time" value={analysis.flightTime.toFixed(1)} unit="s" />
          </div>
        </div>
      )}

      {state.events && state.events.length > 0 && (
        <div className="chart-card">
          <div className="chart-title">Mission Event Timeline</div>
          <div className="timeline-list">
            {state.events.map((event, index) => (
              <div key={`${event.type}-${index}`} className="timeline-item">
                <div className="timeline-type">{event.type.toUpperCase()}</div>
                <div className="timeline-meta">Altitude {event.height.toFixed(1)} m</div>
                <div className="timeline-meta">T+ {event.time.toFixed(2)} s</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TelemetryChart data={history} dataKey="height" title="Height vs Time" events={events} />
      <TelemetryChart data={history} dataKey="velocity" title="Velocity vs Time" color="#82ca9d" events={events} />
      <TelemetryChart data={history} dataKey="fuel" title="Fuel vs Time" color="#ff7300" events={events} />
      <TelemetryChart data={history} dataKey="totalMass" title="Total Mass vs Time" color="#8884d8" events={events} />
      <TelemetryChart data={history} dataKey="currentThrust" title="Thrust vs Time" color="#ffc658" events={state.events} />
    </div>
  );
}

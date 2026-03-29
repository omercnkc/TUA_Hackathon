import React from "react";

export default function EventSummary({ report, events }) {
  if (!report) {
    return (
      <div className="surface-card">
        <h3 className="surface-title">Flight Report</h3>
        <p className="surface-subtitle">No completed flight data yet.</p>
      </div>
    );
  }

  return (
    <div className="surface-card">
      <h3 className="surface-title">Flight Report</h3>
      <div className="metric-grid">
        <div className="metric-card">
          <span className="metric-label">Max Height</span>
          <div className="metric-value">{report.maxHeight?.toFixed(0) ?? "0"}<span className="metric-unit">m</span></div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Max Velocity</span>
          <div className="metric-value">{report.maxVelocity?.toFixed(1) ?? "0"}<span className="metric-unit">m/s</span></div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Flight Time</span>
          <div className="metric-value">{report.flightTime?.toFixed(1) ?? "0"}<span className="metric-unit">s</span></div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Impact Velocity</span>
          <div className="metric-value">{report.impactVelocity?.toFixed(1) ?? "0"}<span className="metric-unit">m/s</span></div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">Recorded Events</div>
        {events && events.length > 0 ? (
          <div className="timeline-list">
            {events.map((event, index) => (
              <div key={`${event.type}-${index}`} className="timeline-item">
                <div className="timeline-type">{event.type.toUpperCase()}</div>
                <div className="timeline-meta">Altitude {event.height.toFixed(1)} m</div>
                <div className="timeline-meta">T+ {event.time.toFixed(2)} s</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-subtitle" style={{ marginBottom: 0 }}>No events recorded yet.</div>
        )}
      </div>
    </div>
  );
}

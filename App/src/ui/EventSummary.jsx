import React from "react";

export default function EventSummary({ report, events }) {
  if (!report) {
    return (
      <div style={{ marginTop: "16px", padding: "16px" }}>
        <h3>Flight Report</h3>
        <div>No completed flight data yet.</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc" }}>
      <h3>Flight Report</h3>

      <div>Max Height: {report.maxHeight.toFixed(2)} m</div>
      <div>Max Velocity: {report.maxVelocity.toFixed(2)} m/s</div>
      <div>Total Flight Time: {report.totalFlightTime.toFixed(2)} s</div>
      <div>Impact Velocity: {report.impactVelocity.toFixed(2)} m/s</div>

      <div style={{ marginTop: "12px" }}>
        <h4>Flight Events</h4>
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div key={index}>
              {event.type.toUpperCase()} — t={event.time.toFixed(2)}s — h={event.height.toFixed(2)}m
            </div>
          ))
        ) : (
          <div>No events recorded yet.</div>
        )}
      </div>
    </div>
  );
}

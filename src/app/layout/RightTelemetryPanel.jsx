import React from "react";
import FlightDashboard from "../../ui/panels/FlightDashboard";
import EventSummary from "../../ui/panels/EventSummary";
import ScenarioResult from "../../ui/panels/ScenarioResult";

export default function RightTelemetryPanel({ sim, analysis }) {
  return (
    <div className="panel panel-scroll" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FlightDashboard state={sim.state} analysis={analysis} history={sim.history} events={sim.events} />
      <EventSummary report={analysis} events={sim.events} />
      <ScenarioResult result={sim.scenarioResult} />
    </div>
  );
}

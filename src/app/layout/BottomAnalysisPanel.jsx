import React from "react";
import ComparisonDashboard from "../../ui/panels/ComparisonDashboard";

export default function BottomAnalysisPanel({ sim, analysis }) {
  return (
    <div className="panel panel-scroll">
      <ComparisonDashboard runs={sim.runs} />
    </div>
  );
}

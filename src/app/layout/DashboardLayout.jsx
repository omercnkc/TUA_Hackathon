import React from "react";
import TopBar from "./TopBar";
import LeftControlPanel from "./LeftControlPanel";
import SceneViewport from "./SceneViewport";
import RightTelemetryPanel from "./RightTelemetryPanel";
import BottomAnalysisPanel from "./BottomAnalysisPanel";
import "./dashboard.css";

export default function DashboardLayout({ sim, analysis }) {
  return (
    <div className="dash">
      <TopBar sim={sim} />
      <div className="dash-main">
        <LeftControlPanel sim={sim} />
        <SceneViewport sim={sim} />
        <RightTelemetryPanel sim={sim} analysis={analysis} />
      </div>
      <BottomAnalysisPanel sim={sim} analysis={analysis} />
    </div>
  );
}

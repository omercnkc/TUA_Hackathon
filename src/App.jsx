import React from "react";
import SceneViewport from "./app/layout/SceneViewport";
import LeftControlPanel from "./app/layout/LeftControlPanel";
import RightTelemetryPanel from "./app/layout/RightTelemetryPanel";
import BottomAnalysisPanel from "./app/layout/BottomAnalysisPanel";
import TopBar from "./app/layout/TopBar";
import { useSimulation } from "./engine/hooks/useSimulation";
import "./app/layout/dashboard.css";

function GroundControl({ sim }) {
  return (
    <div className="dash" style={{ display: 'grid', gridTemplateRows: '64px 1fr 280px', height: '100vh', gap: '12px', padding: '12px' }}>
      <TopBar sim={sim} />
      <div className="dash-main" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr 340px', gap: '12px' }}>
        <LeftControlPanel sim={sim} />
        {/* Minimized Viewport for Ground Control */}
        <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, fontSize: '10px', color: '#00e5ff', opacity: 0.6 }}>REMOTE_MONITOR_ACTIVE</div>
            <SceneViewport sim={sim} />
        </div>
        <RightTelemetryPanel sim={sim} analysis={sim.analysis} />
      </div>
      <BottomAnalysisPanel sim={sim} analysis={sim.analysis} />
    </div>
  );
}

function CapsuleHUD({ sim }) {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', background: '#000', overflow: 'hidden' }}>
        <SceneViewport sim={sim} />
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          color: '#00e5ff', 
          background: 'rgba(0,30,40,0.4)',
          backdropFilter: 'blur(5px)',
          padding: '5px 20px',
          border: '1px solid #00e5ff',
          fontSize: '10px', 
          fontFamily: 'monospace',
          letterSpacing: '2px',
          pointerEvents: 'none'
        }}>
            LIVE_LINK_ACTIVE // PRIMARY_UPLINK: CALIBRATED
        </div>
    </div>
  );
}

export default function App() {
  const sim = useSimulation();

  // Route based on ?mode=hud parameter
  if (sim.isHUDMode) {
    return <CapsuleHUD sim={sim} />;
  }

  // Default: Mission Control (Master Engine)
  return <GroundControl sim={sim} />;
}

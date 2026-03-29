import React from "react";
import ControlPanel from "../../ui/panels/ControlPanel";
import SimulationControls from "../../ui/panels/SimulationControls";
import ScenarioPanel from "../../ui/panels/ScenarioPanel";

export default function LeftControlPanel({ sim }) {
  return (
    <div className="panel panel-scroll" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="section-title">Engine Controls</div>
        <SimulationControls
          isPaused={sim.state.isPaused}
          simulationSpeed={sim.state.simulationSpeed}
          onTogglePause={sim.togglePause}
          onStepOnce={sim.stepOnce}
          onChangeSpeed={sim.setSimulationSpeed}
        />
      </div>

      <div>
        <div className="section-title">Mission Presets & Settings</div>
        <ControlPanel
          state={sim.state}
          onApplySettings={sim.applySettings}
          onSelectPreset={sim.applySettings}
        />
      </div>

      <div>
        <div className="section-title">Scenarios</div>
        <ScenarioPanel
          activeScenario={sim.activeScenario}
          onSelectScenario={sim.setScenario}
        />
      </div>
    </div>
  );
}

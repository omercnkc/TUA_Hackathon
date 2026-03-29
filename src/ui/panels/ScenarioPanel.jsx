import React from "react";
import { simulationScenarios } from "../../engine/simulation/scenario/scenarios";

export default function ScenarioPanel({ activeScenario, onSelectScenario }) {
  const scenarios = Object.values(simulationScenarios);

  return (
    <div style={{ margin: "16px", padding: "16px", border: "1px solid #ccc" }}>
      <h2>Mission Scenarios</h2>

      <select
        value={activeScenario?.id || ""}
        onChange={(e) => {
          const selected = scenarios.find((s) => s.id === e.target.value) || null;
          onSelectScenario(selected);
        }}
      >
        <option value="">No Scenario</option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>

      {activeScenario && (
        <div style={{ marginTop: "12px" }}>
          <div><strong>Selected:</strong> {activeScenario.name}</div>
          <div>{activeScenario.description}</div>
        </div>
      )}
    </div>
  );
}

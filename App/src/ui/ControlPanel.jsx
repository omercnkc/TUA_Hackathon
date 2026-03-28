import React from "react";
import { useState } from "react";
import { simulationPresets } from "../simulation/core/presets";

export default function ControlPanel({
  state,
  onApplySettings,
  onSelectPreset
}) {
  const [form, setForm] = useState({
    fuel: state.fuel,
    mass: state.mass,
    thrust: state.thrust,
    burnRate: state.burnRate,
    dragCoefficient: state.dragCoefficient
  });




  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleApply = () => {
    onApplySettings(form);
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    const preset = simulationPresets[presetKey];
    if (!preset) return;

    setForm(preset);
    onSelectPreset(preset);
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #ccc", margin: "16px" }}>
      <h2>Simulation Controls</h2>

      <div style={{ marginBottom: "12px" }}>
        <label>Preset: </label>
        <select onChange={handlePresetChange} defaultValue="">
          <option value="" disabled>
            Select preset
          </option>
          <option value="default">Default</option>
          <option value="lightRocket">Light Rocket</option>
          <option value="heavyRocket">Heavy Rocket</option>
          <option value="highThrust">High Thrust</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: "8px", maxWidth: "300px" }}>
        <label>
          Fuel
          <input
            type="number"
            value={form.fuel}
            onChange={(e) => handleChange("fuel", e.target.value)}
          />
        </label>

        <label>
          Mass
          <input
            type="number"
            value={form.mass}
            onChange={(e) => handleChange("mass", e.target.value)}
          />
        </label>

        <label>
          Thrust
          <input
            type="number"
            value={form.thrust}
            onChange={(e) => handleChange("thrust", e.target.value)}
          />
        </label>

        <label>
          Burn Rate
          <input
            type="number"
            step="0.1"
            value={form.burnRate}
            onChange={(e) => handleChange("burnRate", e.target.value)}
          />
        </label>

        <label>
          Drag Coefficient
          <input
            type="number"
            step="0.001"
            value={form.dragCoefficient}
            onChange={(e) => handleChange("dragCoefficient", e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleApply} style={{ marginTop: "12px" }}>
        Apply Settings
      </button>
    </div>
  );
}
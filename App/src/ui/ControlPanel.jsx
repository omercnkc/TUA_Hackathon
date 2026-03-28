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

  const [validationResult, setValidationResult] = useState(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleApply = () => {
    const result = onApplySettings(form);
    setValidationResult(result);
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    const preset = simulationPresets[presetKey];
    if (!preset) return;

    setForm(preset);
    const result = onSelectPreset(preset);
    setValidationResult(result);
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

      {validationResult && (
        <div style={{ marginTop: "16px" }}>
          <h3>Validation</h3>

          {Object.keys(validationResult.errors).length > 0 ? (
            <div style={{ color: "#ff6b6b" }}>
              {Object.entries(validationResult.errors).map(([key, message]) => (
                <div key={key}>⚠️ {message}</div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#51cf66" }}>✅ No correction needed.</div>
          )}

          {validationResult.warnings?.length > 0 && (
            <div style={{ marginTop: "8px", color: "#fcc419" }}>
              <h4>Warnings</h4>
              {validationResult.warnings.map((warning, index) => (
                <div key={index}>⚠️ {warning}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
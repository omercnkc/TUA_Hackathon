import React, { useMemo, useState } from "react";
import { simulationPresets } from "../../engine/simulation/core/presets";

export default function ControlPanel({
  state,
  onApplySettings,
  onSelectPreset
}) {
  const [form, setForm] = useState({
    fuel: state.fuel,
    fuelMass: state.fuelMass,
    dryMass: state.dryMass,
    thrust: state.thrust,
    burnRate: state.burnRate,
    dragCoefficient: state.dragCoefficient
  });

  const [validationResult, setValidationResult] = useState(null);

  const estimates = useMemo(() => {
    const totalMass = (Number(form.fuelMass) || 0) + (Number(form.dryMass) || 0);
    const thrustToWeight = totalMass > 0 ? (Number(form.thrust) || 0) / (totalMass * 9.81) : 0;
    const burnDuration = (Number(form.fuelMass) || 0) / Math.max(Number(form.burnRate) || 1, 0.0001);

    return {
      totalMass,
      thrustToWeight,
      burnDuration,
      fuelShare: totalMass > 0 ? ((Number(form.fuelMass) || 0) / totalMass) * 100 : 0
    };
  }, [form]);

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
    <div className="surface-card">
      <h3 className="surface-title">Mission Tuning</h3>
      <p className="surface-subtitle">
        Adjust mass, thrust, and drag as one cohesive flight profile and review the resulting envelope live.
      </p>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label">Preset Profile</label>
        <select onChange={handlePresetChange} defaultValue="">
          <option value="" disabled>Select preset</option>
          <option value="default">Default</option>
          <option value="lightRocket">Light Rocket</option>
          <option value="heavyRocket">Heavy Rocket</option>
          <option value="highThrust">High Thrust</option>
        </select>
      </div>

      <div className="metric-grid metric-grid-3" style={{ marginBottom: 16 }}>
        <div className="metric-card">
          <span className="metric-label">Wet Mass</span>
          <div className="metric-value">{estimates.totalMass.toFixed(0)}<span className="metric-unit">kg</span></div>
        </div>
        <div className="metric-card">
          <span className="metric-label">T/W Ratio</span>
          <div className="metric-value">{estimates.thrustToWeight.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Burn Window</span>
          <div className="metric-value">{estimates.burnDuration.toFixed(1)}<span className="metric-unit">s</span></div>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">Fuel</label>
          <input type="number" value={form.fuel} onChange={(e) => handleChange("fuel", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Fuel Mass</label>
          <input type="number" value={form.fuelMass} onChange={(e) => handleChange("fuelMass", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Dry Mass</label>
          <input type="number" value={form.dryMass} onChange={(e) => handleChange("dryMass", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Thrust</label>
          <input type="number" value={form.thrust} onChange={(e) => handleChange("thrust", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Burn Rate</label>
          <input type="number" step="0.1" value={form.burnRate} onChange={(e) => handleChange("burnRate", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Drag Coefficient</label>
          <input type="number" step="0.001" value={form.dragCoefficient} onChange={(e) => handleChange("dragCoefficient", e.target.value)} />
        </div>
      </div>

      <div className="validation-box">
        <div className="progress-stack">
          <div className="progress-row">
            <div className="progress-label">Fuel share</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(estimates.fuelShare, 100)}%` }} />
            </div>
            <div className="progress-value">{estimates.fuelShare.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleApply} style={{ marginTop: 16 }}>
        Apply Flight Profile
      </button>

      {validationResult && (
        <div className="validation-box">
          <div className="surface-title" style={{ fontSize: 16, marginBottom: 10 }}>Validation</div>
          {Object.keys(validationResult.errors).length > 0 ? (
            <div className="notice-bad">
              {Object.entries(validationResult.errors).map(([key, message]) => (
                <div key={key}>{message}</div>
              ))}
            </div>
          ) : (
            <div className="notice-good">All current values are within the accepted operating range.</div>
          )}

          {validationResult.warnings?.length > 0 && (
            <div className="notice-warn" style={{ marginTop: 10 }}>
              {validationResult.warnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

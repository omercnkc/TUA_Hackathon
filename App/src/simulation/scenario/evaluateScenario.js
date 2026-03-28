export function evaluateScenario({ scenario, state, analysis }) {
  if (!scenario || !analysis) return null;

  const result = {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    success: false,
    reasons: []
  };

  if (scenario.targetAltitude !== undefined) {
    if (analysis.maxHeight >= scenario.targetAltitude) {
      result.reasons.push(
        `✅ Target altitude reached: ${analysis.maxHeight.toFixed(2)} m`
      );
    } else {
      result.reasons.push(
        `❌ Target altitude not reached. Max height: ${analysis.maxHeight.toFixed(2)} m (target: ${scenario.targetAltitude} m)`
      );
    }
  }

  if (scenario.minimumMass !== undefined) {
    if (state.mass >= scenario.minimumMass) {
      result.reasons.push(
        `✅ Payload mass condition satisfied: ${state.mass.toFixed(2)} kg`
      );
    } else {
      result.reasons.push(
        `❌ Payload mass too low. Current mass: ${state.mass.toFixed(2)} kg (minimum: ${scenario.minimumMass} kg)`
      );
    }
  }

  if (scenario.minimumRemainingFuel !== undefined) {
    if (state.fuel >= scenario.minimumRemainingFuel) {
      result.reasons.push(
        `✅ Fuel efficiency condition satisfied. Remaining fuel: ${state.fuel.toFixed(2)}`
      );
    } else {
      result.reasons.push(
        `❌ Remaining fuel too low: ${state.fuel.toFixed(2)} (minimum: ${scenario.minimumRemainingFuel})`
      );
    }
  }

  const altitudeOk =
    scenario.targetAltitude === undefined ||
    analysis.maxHeight >= scenario.targetAltitude;

  const massOk =
    scenario.minimumMass === undefined ||
    state.mass >= scenario.minimumMass;

  const fuelOk =
    scenario.minimumRemainingFuel === undefined ||
    state.fuel >= scenario.minimumRemainingFuel;

  result.success = altitudeOk && massOk && fuelOk;

  return result;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function validateSimulationSettings(input) {
  const rawFuel = toNumber(input.fuel, 100);
  const rawFuelMass = toNumber(input.fuelMass, 100);
  const rawDryMass = toNumber(input.dryMass, 900);
  const rawThrust = toNumber(input.thrust, 15000);
  const rawBurnRate = toNumber(input.burnRate, 1);
  const rawDragCoefficient = toNumber(input.dragCoefficient, 0.02);

  const rawRampUpDuration = toNumber(input.thrustCurve?.rampUpDuration, 2);
  const rawSteadyDuration = toNumber(input.thrustCurve?.steadyDuration, 6);
  const rawTailOffDuration = toNumber(input.thrustCurve?.tailOffDuration, 2);
  const rawPeakThrustMultiplier = toNumber(input.thrustCurve?.peakThrustMultiplier, 1);

  const sanitized = {
    fuel: clamp(rawFuel, 0, 10000),
    fuelMass: clamp(rawFuelMass, 0, 100000),
    dryMass: clamp(rawDryMass, 1, 100000),
    thrust: clamp(rawThrust, 0, 1000000),
    burnRate: clamp(rawBurnRate, 0.01, 1000),
    dragCoefficient: clamp(rawDragCoefficient, 0, 10),
    thrustCurve: {
      rampUpDuration: clamp(rawRampUpDuration, 0.1, 60),
      steadyDuration: clamp(rawSteadyDuration, 0.1, 300),
      tailOffDuration: clamp(rawTailOffDuration, 0.1, 60),
      peakThrustMultiplier: clamp(rawPeakThrustMultiplier, 0.1, 5)
    }
  };

  const totalMass = sanitized.dryMass + sanitized.fuelMass;

  const errors = {};
  const warnings = [];

  if (rawFuel !== sanitized.fuel) {
    errors.fuel = `Fuel değeri ${sanitized.fuel} olarak düzeltildi.`;
  }

  if (rawFuelMass !== sanitized.fuelMass) {
    errors.fuelMass = `Fuel Mass değeri ${sanitized.fuelMass} olarak düzeltildi.`;
  }

  if (rawDryMass !== sanitized.dryMass) {
    errors.dryMass = `Dry Mass değeri ${sanitized.dryMass} olarak düzeltildi.`;
  }

  if (rawThrust !== sanitized.thrust) {
    errors.thrust = `Thrust değeri ${sanitized.thrust} olarak düzeltildi.`;
  }

  if (rawBurnRate !== sanitized.burnRate) {
    errors.burnRate = `Burn Rate değeri ${sanitized.burnRate} olarak düzeltildi.`;
  }

  if (rawDragCoefficient !== sanitized.dragCoefficient) {
    errors.dragCoefficient = `Drag Coefficient değeri ${sanitized.dragCoefficient} olarak düzeltildi.`;
  }

  if (sanitized.thrust === 0) {
    warnings.push("Thrust 0 ise roket kalkış yapamaz.");
  }

  if (sanitized.burnRate > sanitized.fuel && sanitized.fuel > 0) {
    warnings.push("Burn rate fuel değerinden çok yüksek, yakıt çok hızlı bitebilir.");
  }

  if (totalMass > 50000 && sanitized.thrust < 10000) {
    warnings.push("Total mass is very high and thrust is low. Lift-off may fail.");
  }

  if (sanitized.thrustCurve.peakThrustMultiplier > 2) {
    warnings.push("Peak thrust multiplier is very high. Flight may become unstable.");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized: {
      ...sanitized,
      totalMass
    },
    errors,
    warnings
  };
}

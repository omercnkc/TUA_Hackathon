function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function validateSimulationSettings(input) {
  const rawFuel = toNumber(input.fuel, 100);
  const rawMass = toNumber(input.mass, 1000);
  const rawThrust = toNumber(input.thrust, 15000);
  const rawBurnRate = toNumber(input.burnRate, 1);
  const rawDragCoefficient = toNumber(input.dragCoefficient, 0.02);

  const sanitized = {
    fuel: clamp(rawFuel, 0, 10000),
    mass: clamp(rawMass, 1, 100000),
    thrust: clamp(rawThrust, 0, 1000000),
    burnRate: clamp(rawBurnRate, 0.01, 1000),
    dragCoefficient: clamp(rawDragCoefficient, 0, 10)
  };

  const errors = {};
  const warnings = [];

  if (rawFuel !== sanitized.fuel) {
    errors.fuel = `Fuel değeri ${sanitized.fuel} olarak düzeltildi.`;
  }

  if (rawMass !== sanitized.mass) {
    errors.mass = `Mass değeri ${sanitized.mass} olarak düzeltildi.`;
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

  if (sanitized.mass > 50000 && sanitized.thrust < 10000) {
    warnings.push("Mass çok yüksek ve thrust düşük, roket kalkmayabilir.");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
    warnings
  };
}

export function getThrustPhase(timeSinceLaunch, curve, fuel) {
  if (fuel <= 0) return "burnout";
  if (timeSinceLaunch < 0) return "idle";

  const rampUpEnd = curve.rampUpDuration;
  const steadyEnd = rampUpEnd + curve.steadyDuration;
  const tailOffEnd = steadyEnd + curve.tailOffDuration;

  if (timeSinceLaunch < rampUpEnd) return "rampUp";
  if (timeSinceLaunch < steadyEnd) return "steady";
  if (timeSinceLaunch < tailOffEnd) return "tailOff";

  return "burnout";
}

export function getThrustMultiplier(timeSinceLaunch, curve, fuel) {
  if (fuel <= 0) return 0;
  if (timeSinceLaunch < 0) return 0;

  const rampUpEnd = curve.rampUpDuration;
  const steadyEnd = rampUpEnd + curve.steadyDuration;
  const tailOffEnd = steadyEnd + curve.tailOffDuration;

  if (timeSinceLaunch < rampUpEnd) {
    return (timeSinceLaunch / rampUpEnd) * curve.peakThrustMultiplier;
  }

  if (timeSinceLaunch < steadyEnd) {
    return curve.peakThrustMultiplier;
  }

  if (timeSinceLaunch < tailOffEnd) {
    const tailProgress = (timeSinceLaunch - steadyEnd) / curve.tailOffDuration;

    return (1 - tailProgress) * curve.peakThrustMultiplier;
  }

  return 0;
}

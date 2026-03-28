import { getThrustMultiplier, getThrustPhase } from "./thrustCurve";

export function calculateThrust(baseThrust, fuel, timeSinceLaunch, thrustCurve) {
  const multiplier = getThrustMultiplier(
    timeSinceLaunch,
    thrustCurve,
    fuel
  );

  return baseThrust * multiplier;
}

export function calculateThrustState(baseThrust, fuel, timeSinceLaunch, thrustCurve) {
  const phase = getThrustPhase(timeSinceLaunch, thrustCurve, fuel);
  const currentThrust = calculateThrust(
    baseThrust,
    fuel,
    timeSinceLaunch,
    thrustCurve
  );

  return {
    phase,
    currentThrust
  };
}

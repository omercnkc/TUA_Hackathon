import { initialState } from "../core/simulationState";

export function restoreSessionState(session) {
  if (!session) return initialState;

  return {
    ...initialState,

    fuel: session.settings?.fuel ?? initialState.fuel,
    fuelMass: session.settings?.fuelMass ?? initialState.fuelMass,
    dryMass: session.settings?.dryMass ?? initialState.dryMass,
    totalMass: session.settings?.totalMass ?? initialState.totalMass,
    mass: session.settings?.mass ?? initialState.mass,
    thrust: session.settings?.thrust ?? initialState.thrust,
    burnRate: session.settings?.burnRate ?? initialState.burnRate,
    dragCoefficient:
      session.settings?.dragCoefficient ?? initialState.dragCoefficient,
    thrustCurve: session.settings?.thrustCurve ?? initialState.thrustCurve,

    activeScenario: session.activeScenario ?? null,
    simulationSpeed: session.simulationSpeed ?? 1
  };
}

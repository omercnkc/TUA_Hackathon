export function buildFlightReport({ analysis, events, state }) {
  if (!analysis) return null;

  const getEvent = (type) => events?.find((event) => event.type === type);

  const launchEvent = getEvent("launch");
  const burnoutEvent = getEvent("burnout");
  const apogeeEvent = getEvent("apogee");
  const landingEvent = getEvent("landing");

  return {
    maxHeight: analysis.maxHeight,
    maxVelocity: analysis.maxVelocity,
    totalFlightTime: analysis.flightTime,
    impactVelocity: state?.impactVelocity ?? 0,

    launchTime: launchEvent?.time ?? null,
    burnoutTime: burnoutEvent?.time ?? null,
    apogeeTime: apogeeEvent?.time ?? null,
    landingTime: landingEvent?.time ?? null,

    launchHeight: launchEvent?.height ?? null,
    burnoutHeight: burnoutEvent?.height ?? null,
    apogeeHeight: apogeeEvent?.height ?? null,
    landingHeight: landingEvent?.height ?? null
  };
}

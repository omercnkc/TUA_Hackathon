export function detectEvents(prevState, newState, events) {
  const newEvents = [...events];

  // Launch
  if (prevState.state === "countdown" && newState.state === "launch") {
    newEvents.push({
      type: "launch",
      time: newState.time,
      height: newState.height
    });
  }

  // Burnout
  if (prevState.state === "launch" && newState.state === "burnout") {
    newEvents.push({
      type: "burnout",
      time: newState.time,
      height: newState.height
    });
  }

  // Apogee (tepe noktası)
  if (
    prevState.velocity > 0 &&
    newState.velocity <= 0 &&
    prevState.state !== "falling"
  ) {
    newEvents.push({
      type: "apogee",
      time: newState.time,
      height: newState.height
    });
  }

  // Landing
  if (prevState.state !== "landed" && newState.state === "landed") {
    newEvents.push({
      type: "landing",
      time: newState.time,
      height: newState.height
    });
  }

  return newEvents;
}
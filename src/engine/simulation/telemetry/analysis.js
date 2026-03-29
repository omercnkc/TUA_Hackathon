export function analyzeFlight(history) {
  if (!history || history.length === 0) return null;

  let maxHeight = 0;
  let maxVelocity = 0;

  for (let i = 0; i < history.length; i++) {
    const h = history[i];

    if (h.height > maxHeight) maxHeight = h.height;
    if (Math.abs(h.velocity) > maxVelocity) maxVelocity = Math.abs(h.velocity);
  }

  const flightTime = history[history.length - 1].time;

  const impactVelocity = history[history.length - 1].velocity;
  
  return {
    maxHeight,
    maxVelocity,
    flightTime,
    impactVelocity
  };
}
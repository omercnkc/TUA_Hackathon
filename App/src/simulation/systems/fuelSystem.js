export function updateFuel(fuel, burnRate, dt) {
  const newFuel = fuel - burnRate * dt;
  return newFuel > 0 ? newFuel : 0;
}
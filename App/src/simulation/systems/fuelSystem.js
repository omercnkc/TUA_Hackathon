export function updateFuel(fuel, burnRate, dt) {
  const newFuel = fuel - burnRate * dt;
  return newFuel > 0 ? newFuel : 0;
}

export function updateFuelMass(fuelMass, burnRate, dt) {
  const newFuelMass = fuelMass - burnRate * dt;
  return newFuelMass > 0 ? newFuelMass : 0;
}
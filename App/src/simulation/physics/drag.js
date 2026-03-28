// src/simulation/physics/drag.js

export function calculateAirDensity(height) {
  const rho0 = 1.225; // kg/m3 deniz seviyesi
  const H = 8500;     // scale height
  return rho0 * Math.exp(-height / H);
}

export function calculateDrag(velocity, dragCoefficient, airDensity) {
  return dragCoefficient * airDensity * velocity * velocity;
}
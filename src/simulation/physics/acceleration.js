export function calculateAcceleration(thrust, gravity, drag, mass) {
  return (thrust - gravity - drag) / mass;
}
import { GRAVITY } from "../core/constants";

export function calculateGravity(mass) {
  return mass * GRAVITY;
}
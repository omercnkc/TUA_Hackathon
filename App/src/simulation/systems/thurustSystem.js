// src/simulation/systems/thurustSystem.js

/**
 * Motor Verim Eğrisi (Ramp-up):
 * İlk 2 saniyede thrust kademeli olarak artar (0 → tam thrust).
 * Bu gerçekçi bir motor ateşleme davranışı simüle eder.
 *
 * @param {number} thrust        - Motorun maksimum itme gücü (N)
 * @param {number} fuel          - Kalan yakıt miktarı
 * @param {number} timeSinceLaunch - Fırlatmadan bu yana geçen süre (s)
 */
export function calculateThrust(thrust, fuel, timeSinceLaunch = 0) {
  if (fuel <= 0) return 0;

  // 0-2 saniye ramp-up: motoru kademeli başlat
  const RAMP_TIME = 2; // saniye
  const factor = timeSinceLaunch < RAMP_TIME
    ? timeSinceLaunch / RAMP_TIME
    : 1;

  return thrust * factor;
}
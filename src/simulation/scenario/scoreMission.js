function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRating(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

export function scoreMission({ scenario, state, analysis }) {
  if (!analysis) return null;

  const maxHeight = analysis.maxHeight || 0;
  const maxVelocity = analysis.maxVelocity || 0;
  const impactVelocity = Math.abs(state.impactVelocity || 0);
  const remainingFuel = state.fuel || 0;

  let altitudeScore = 0;
  let fuelEfficiencyScore = 50;
  let landingScore = 50;
  let velocityControlScore = 50;

  if (scenario?.targetAltitude) {
    altitudeScore = clamp(
      (maxHeight / scenario.targetAltitude) * 100,
      0,
      100
    );
  } else {
    altitudeScore = clamp(maxHeight / 1000, 0, 100);
  }

  if (scenario?.minimumRemainingFuel !== undefined) {
    fuelEfficiencyScore = clamp(
      (remainingFuel / scenario.minimumRemainingFuel) * 100,
      0,
      100
    );
  } else {
    fuelEfficiencyScore = clamp(remainingFuel, 0, 100);
  }

  // Düşük impact velocity daha iyi
  landingScore = clamp(100 - impactVelocity, 0, 100);

  // Aşırı yüksek max velocity biraz cezalandırılsın
  velocityControlScore = clamp(100 - maxVelocity * 0.5, 0, 100);

  const overallScore =
    altitudeScore * 0.4 +
    fuelEfficiencyScore * 0.25 +
    landingScore * 0.2 +
    velocityControlScore * 0.15;

  return {
    overallScore: Number(overallScore.toFixed(2)),
    rating: getRating(overallScore),
    breakdown: {
      altitudeScore: Number(altitudeScore.toFixed(2)),
      fuelEfficiencyScore: Number(fuelEfficiencyScore.toFixed(2)),
      landingScore: Number(landingScore.toFixed(2)),
      velocityControlScore: Number(velocityControlScore.toFixed(2))
    }
  };
}

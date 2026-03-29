export function compareRuns(previousRun, currentRun) {
  if (!previousRun || !currentRun) return null;

  const previousAnalysis = previousRun.analysis;
  const currentAnalysis = currentRun.analysis;

  if (!previousAnalysis || !currentAnalysis) return null;

  return {
    maxHeightDiff:
      currentAnalysis.maxHeight - previousAnalysis.maxHeight,

    maxVelocityDiff:
      currentAnalysis.maxVelocity - previousAnalysis.maxVelocity,

    flightTimeDiff:
      currentAnalysis.flightTime - previousAnalysis.flightTime
  };
}

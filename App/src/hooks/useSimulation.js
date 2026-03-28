import React, { useEffect, useRef, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger, getHistory } from "../simulation/telemetry/dataLogger";
import { validateSimulationSettings } from "../simulation/utils/validateSimulationSettings";
import { analyzeFlight } from "../simulation/telemetry/analysis";
import { createRunSnapshot } from "../simulation/comparison/createRunSnapshot";
import { saveRun, getRuns, resetRuns } from "../simulation/comparison/runStore";

export function useSimulation() {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [runCount, setRunCount] = useState(0); // triggers re-render when runs change

  const historyTickRef = useRef(0);
  const hasSavedRunRef = useRef(false);
  const HISTORY_UPDATE_EVERY = 30;

  // Main simulation loop
  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      setState((prev) => stepSimulation(prev));

      historyTickRef.current += 1;
      if (historyTickRef.current % HISTORY_UPDATE_EVERY === 0) {
        setHistory(getHistory());
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Auto-save run when flight lands
  useEffect(() => {
    if (state.state === "landed" && !hasSavedRunRef.current) {
      const currentHistory = getHistory();
      const analysis = analyzeFlight(currentHistory);

      if (analysis) {
        const runSnapshot = createRunSnapshot({
          state,
          history: currentHistory,
          events: state.events || [],
          analysis
        });

        saveRun(runSnapshot);
        hasSavedRunRef.current = true;
        setRunCount((c) => c + 1); // trigger re-render
        setHistory(currentHistory); // final sync
      }
    }

    if (state.state === "idle" || state.state === "countdown" || state.state === "launch") {
      hasSavedRunRef.current = false;
    }
  }, [state.state]);

  const startCountdown = () => {
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      state: "countdown",
      countdown: 5,
      launchStartTime: null,
    }));
  };

  const resetSimulation = () => {
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState(initialState);
  };

  const applySettings = (settings) => {
    const validation = validateSimulationSettings(settings);

    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      fuel: validation.sanitized.fuel,
      mass: validation.sanitized.mass,
      thrust: validation.sanitized.thrust,
      burnRate: validation.sanitized.burnRate,
      dragCoefficient: validation.sanitized.dragCoefficient,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings
    }));

    return validation;
  };

  const clearRunHistory = () => {
    resetRuns();
    setRunCount(0);
  };

  return {
    state,
    startCountdown,
    resetSimulation,
    applySettings,
    clearRunHistory,
    history: history,
    events: state.events || [],
    runs: getRuns()
  };
}
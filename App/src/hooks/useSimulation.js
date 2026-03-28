import React, { useEffect, useRef, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger, getHistory } from "../simulation/telemetry/dataLogger";
import { validateSimulationSettings } from "../simulation/utils/validateSimulationSettings";
import { analyzeFlight } from "../simulation/telemetry/analysis";
import { createRunSnapshot } from "../simulation/comparison/createRunSnapshot";
import { saveRun, getRuns, resetRuns } from "../simulation/comparison/runStore";
import { evaluateScenario } from "../simulation/scenario/evaluateScenario";

export function useSimulation() {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [runCount, setRunCount] = useState(0);

  const historyTickRef = useRef(0);
  const hasSavedRunRef = useRef(false);
  const HISTORY_UPDATE_EVERY = 30;

  // Main simulation loop with control layer (pause, speed, single-step)
  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      setState((prev) => {
        const effectiveDt = 0.016 * (prev.simulationSpeed || 1);

        if (prev.isPaused) {
          if (prev.stepRequested) {
            const steppedState = stepSimulation(
              { ...prev, stepRequested: false },
              effectiveDt
            );

            return {
              ...steppedState,
              stepRequested: false
            };
          }

          return prev;
        }

        return stepSimulation(prev, effectiveDt);
      });

      historyTickRef.current += 1;
      if (historyTickRef.current % HISTORY_UPDATE_EVERY === 0) {
        setHistory(getHistory());
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Auto-save run + evaluate scenario when flight lands
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

        let scenarioResult = null;
        if (state.activeScenario) {
          scenarioResult = evaluateScenario({
            scenario: state.activeScenario,
            state,
            analysis
          });
        }

        setState((prev) => ({
          ...prev,
          scenarioResult
        }));

        hasSavedRunRef.current = true;
        setRunCount((c) => c + 1);
        setHistory(currentHistory);
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
      activeScenario: prev.activeScenario, // preserve selected scenario
    }));
  };

  const resetSimulation = () => {
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      activeScenario: prev.activeScenario, // preserve selected scenario
    }));
  };

  const applySettings = (settings) => {
    const validation = validateSimulationSettings(settings);

    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      fuel: validation.sanitized.fuel,
      fuelMass: validation.sanitized.fuelMass,
      dryMass: validation.sanitized.dryMass,
      totalMass: validation.sanitized.totalMass,
      mass: validation.sanitized.totalMass,
      thrust: validation.sanitized.thrust,
      burnRate: validation.sanitized.burnRate,
      dragCoefficient: validation.sanitized.dragCoefficient,
      thrustCurve: validation.sanitized.thrustCurve,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
      activeScenario: prev.activeScenario, // preserve selected scenario
    }));

    return validation;
  };

  const setScenario = (scenario) => {
    setState((prev) => ({
      ...prev,
      activeScenario: scenario,
      scenarioResult: null
    }));
  };

  const clearRunHistory = () => {
    resetRuns();
    setRunCount(0);
  };

  const pauseSimulation = () => {
    setState((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeSimulation = () => {
    setState((prev) => ({ ...prev, isPaused: false }));
  };

  const togglePause = () => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const setSimulationSpeed = (speed) => {
    setState((prev) => ({ ...prev, simulationSpeed: speed }));
  };

  const stepOnce = () => {
    setState((prev) => ({
      ...prev,
      stepRequested: true,
      isPaused: true
    }));
  };

  return {
    state,
    startCountdown,
    resetSimulation,
    applySettings,
    setScenario,
    clearRunHistory,
    history: history,
    events: state.events || [],
    runs: getRuns(),
    activeScenario: state.activeScenario,
    scenarioResult: state.scenarioResult,
    pauseSimulation,
    resumeSimulation,
    togglePause,
    setSimulationSpeed,
    stepOnce
  };
}
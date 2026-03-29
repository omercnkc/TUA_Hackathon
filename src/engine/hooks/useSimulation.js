import React, { useEffect, useRef, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger, getHistory } from "../simulation/telemetry/dataLogger";
import { analyzeFlight } from "../simulation/telemetry/analysis";
import { createRunSnapshot } from "../simulation/comparison/createRunSnapshot";
import { saveRun, getRuns, resetRuns } from "../simulation/comparison/runStore";
import { evaluateScenario } from "../simulation/scenario/evaluateScenario";
import {
  saveSessionToStorage,
  loadSessionFromStorage,
  clearSessionFromStorage
} from "../simulation/persistence/storage";
import { createSessionSnapshot } from "../simulation/persistence/sessionSnapshot";
import { restoreSessionState } from "../simulation/persistence/restoreSessionState";
import { validateSimulationSettings } from "../simulation/utils/validateSimulationSettings";
import { SimulationBridge } from "../simulationBridge";

export function useSimulation() {
  // Determine if this instance should be a PASSIVE HUD or a MASTER ENGINE
  const isHUDMode = new URLSearchParams(window.location.search).get("mode") === "hud";

  const [state, setState] = useState(() => {
    const savedSession = loadSessionFromStorage();
    return restoreSessionState(savedSession);
  });
  
  const [history, setHistory] = useState([]);
  const [runCount, setRunCount] = useState(0);

  const historyTickRef = useRef(0);
  const hasSavedRunRef = useRef(false);
  const HISTORY_UPDATE_EVERY = 30;

  // PHYSICS LOOP (Only runs in MASTER mode)
  useEffect(() => {
    if (isHUDMode) return; // Passive HUD does not run physics!

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
            return { ...steppedState, stepRequested: false };
          }
          return prev;
        }

        const nextState = stepSimulation(prev, effectiveDt);
        
        // BROADCAST STATE to specific listeners (HUD)
        SimulationBridge.broadcastState({
            state: nextState,
            history: getHistory()
        });

        return nextState;
      });

      historyTickRef.current += 1;
      if (historyTickRef.current % HISTORY_UPDATE_EVERY === 0) {
        setHistory(getHistory());
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHUDMode]);

  // BRIDGE LISTENER
  useEffect(() => {
    return SimulationBridge.subscribe((message) => {
      if (message.type === "SYNC_STATE" && isHUDMode) {
        // Update passive HUD state from the master engine branch
        setState(message.payload.state);
        setHistory(message.payload.history);
      }

      if (message.type === "EXECUTE_COMMAND" && !isHUDMode) {
        // Master engine executes commands from the HUD/Ground control
        console.log("PROTOCOL: Executing incoming command", message.command);
        if (message.command === "IGNITION") startCountdown();
        if (message.command === "ABORT") resetSimulation();
        if (message.command === "RESET") resetSimulation();
      }
    });
  }, [isHUDMode]);

  useEffect(() => {
    if (isHUDMode) return;
    const sessionSnapshot = createSessionSnapshot(state);
    saveSessionToStorage(sessionSnapshot);
  }, [
    state.fuel,
    state.fuelMass,
    state.dryMass,
    state.totalMass,
    state.mass,
    state.thrust,
    state.burnRate,
    state.dragCoefficient,
    state.thrustCurve,
    state.activeScenario,
    state.simulationSpeed,
    isHUDMode
  ]);

  useEffect(() => {
    if (isHUDMode) return;
    if (state.state === "landed" && !hasSavedRunRef.current) {
      const currentHistory = getHistory();
      const analysis = analyzeFlight(currentHistory);

      if (analysis) {
        let scenarioResult = null;
        if (state.activeScenario) {
          scenarioResult = evaluateScenario({
            scenario: state.activeScenario,
            state,
            analysis
          });
        }

        const runSnapshot = createRunSnapshot({
          state: { ...state, scenarioResult },
          history: currentHistory,
          events: state.events || [],
          analysis
        });

        saveRun(runSnapshot);
        setState((prev) => ({ ...prev, scenarioResult }));
        hasSavedRunRef.current = true;
        setRunCount((c) => c + 1);
        setHistory(currentHistory);
      }
    }

    if (state.state === "idle" || state.state === "countdown" || state.state === "launch") {
      hasSavedRunRef.current = false;
    }
  }, [state.state, isHUDMode]);

  const startCountdown = () => {
    if (isHUDMode) {
        SimulationBridge.broadcastCommand("IGNITION");
        return;
    }
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      state: "countdown",
      countdown: 5,
      launchStartTime: null,
      fuel: prev.fuel,
      fuelMass: prev.fuelMass,
      dryMass: prev.dryMass,
      totalMass: prev.totalMass,
      mass: prev.mass,
      thrust: prev.thrust,
      burnRate: prev.burnRate,
      dragCoefficient: prev.dragCoefficient,
      thrustCurve: prev.thrustCurve,
      activeScenario: prev.activeScenario,
      simulationSpeed: prev.simulationSpeed
    }));
  };

  const resetSimulation = () => {
    if (isHUDMode) {
        SimulationBridge.broadcastCommand("RESET");
        return;
    }
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      fuel: prev.fuel,
      fuelMass: prev.fuelMass,
      dryMass: prev.dryMass,
      totalMass: prev.totalMass,
      mass: prev.mass,
      thrust: prev.thrust,
      burnRate: prev.burnRate,
      dragCoefficient: prev.dragCoefficient,
      thrustCurve: prev.thrustCurve,
      activeScenario: prev.activeScenario,
      simulationSpeed: prev.simulationSpeed
    }));
  };

  const applySettings = (settings) => {
    if (isHUDMode) return;
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
      activeScenario: prev.activeScenario,
      simulationSpeed: prev.simulationSpeed
    }));
    return validation;
  };

  const setScenario = (scenario) => {
    if (isHUDMode) return;
    setState((prev) => ({ ...prev, activeScenario: scenario, scenarioResult: null }));
  };

  const clearRunHistory = () => {
    if (isHUDMode) return;
    resetRuns();
    setRunCount(0);
  };

  const togglePause = () => !isHUDMode && setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  const setSimulationSpeed = (speed) => !isHUDMode && setState((prev) => ({ ...prev, simulationSpeed: speed }));
  const stepOnce = () => !isHUDMode && setState((prev) => ({ ...prev, stepRequested: true, isPaused: true }));

  const clearSession = () => {
    if (isHUDMode) return;
    clearSessionFromStorage();
    resetLogger();
    setState(initialState);
  };

  return {
    state,
    isHUDMode,
    startCountdown,
    resetSimulation,
    applySettings,
    setScenario,
    clearRunHistory,
    clearSession,
    history: history,
    events: state.events || [],
    runs: getRuns(),
    activeScenario: state.activeScenario,
    scenarioResult: state.scenarioResult,
    togglePause,
    setSimulationSpeed,
    stepOnce,
    analysis: analyzeFlight(history)
  };
}

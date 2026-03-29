import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { COMMAND_TYPES, HOST_ROLES, MESSAGE_TYPES } from "../protocol/messages";

const HISTORY_UPDATE_EVERY = 30;
const SNAPSHOT_STALE_MS = 2500;
const SNAPSHOT_BROADCAST_INTERVAL_MS = 120;

export function useSimulation() {
  const runtime = useMemo(() => SimulationBridge.runtime, []);
  const hostRole = runtime.hostRole;
  const isHUDMode = hostRole === HOST_ROLES.HUD;
  const isEngineAuthority = hostRole === HOST_ROLES.ENGINE;

  const [state, setState] = useState(() => (
    isEngineAuthority
      ? restoreSessionState(loadSessionFromStorage())
      : { ...initialState }
  ));
  const [history, setHistory] = useState([]);
  const [runs, setRuns] = useState(() => (isEngineAuthority ? [...getRuns()] : []));
  const [connectionStatus, setConnectionStatus] = useState(() => SimulationBridge.getStatus());
  const [now, setNow] = useState(Date.now());

  const historyTickRef = useRef(0);
  const hasSavedRunRef = useRef(false);
  const lastSnapshotBroadcastAtRef = useRef(0);

  const stateRef = useRef(state);
  const runsRef = useRef(runs);
  const actionsRef = useRef({});

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    runsRef.current = runs;
  }, [runs]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => (
    SimulationBridge.subscribeStatus((status) => {
      setConnectionStatus(status);
    })
  ), []);

  const publishSnapshot = (
    nextState = stateRef.current,
    nextRuns = runsRef.current,
    force = false
  ) => {
    if (!isEngineAuthority) {
      return;
    }

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (!force && now - lastSnapshotBroadcastAtRef.current < SNAPSHOT_BROADCAST_INTERVAL_MS) {
      return;
    }

    lastSnapshotBroadcastAtRef.current = now;

    SimulationBridge.broadcastState({
      state: nextState,
      history: getHistory(),
      runs: nextRuns
    });
  };

  useEffect(() => {
    if (!isEngineAuthority) {
      return;
    }

    SimulationBridge.announcePresence();
    publishSnapshot(state, runs, true);
  }, [isEngineAuthority]);

  useEffect(() => {
    publishSnapshot(state, runs);
  }, [state]);

  useEffect(() => {
    publishSnapshot(state, runs, true);
  }, [runs]);

  useEffect(() => {
    if (!isEngineAuthority) {
      return;
    }

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
  }, [isEngineAuthority]);

  useEffect(() => {
    return SimulationBridge.subscribe((message) => {
      if (message.type === MESSAGE_TYPES.STATE_SNAPSHOT && !isEngineAuthority) {
        setState(message.payload.state || { ...initialState });
        setHistory(message.payload.history || []);
        setRuns(message.payload.runs || []);
        return;
      }

      if (message.type !== MESSAGE_TYPES.COMMAND || !isEngineAuthority) {
        return;
      }

      const { command, payload } = message.payload;
      const actions = actionsRef.current;

      switch (command) {
        case COMMAND_TYPES.START_COUNTDOWN:
          actions.startCountdown?.();
          break;
        case COMMAND_TYPES.RESET_SIMULATION:
          actions.resetSimulation?.();
          break;
        case COMMAND_TYPES.APPLY_SETTINGS:
          actions.applySettings?.(payload);
          break;
        case COMMAND_TYPES.SET_SCENARIO:
          actions.setScenario?.(payload);
          break;
        case COMMAND_TYPES.CLEAR_RUN_HISTORY:
          actions.clearRunHistory?.();
          break;
        case COMMAND_TYPES.CLEAR_SESSION:
          actions.clearSession?.();
          break;
        case COMMAND_TYPES.TOGGLE_PAUSE:
          actions.togglePause?.();
          break;
        case COMMAND_TYPES.SET_SIMULATION_SPEED:
          actions.setSimulationSpeed?.(payload);
          break;
        case COMMAND_TYPES.STEP_ONCE:
          actions.stepOnce?.();
          break;
        default:
          break;
      }
    });
  }, [isEngineAuthority]);

  useEffect(() => {
    if (!isEngineAuthority) {
      return;
    }

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
    isEngineAuthority
  ]);

  useEffect(() => {
    if (!isEngineAuthority) {
      return;
    }

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
        const nextRuns = [...getRuns()];
        setRuns(nextRuns);
        setState((prev) => ({ ...prev, scenarioResult }));
        hasSavedRunRef.current = true;
        setHistory(currentHistory);
      }
    }

    if (state.state === "idle" || state.state === "countdown" || state.state === "launch") {
      hasSavedRunRef.current = false;
    }
  }, [state, isEngineAuthority]);

  const startCountdown = () => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.START_COUNTDOWN);
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
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.RESET_SIMULATION);
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
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.APPLY_SETTINGS, settings);
      return;
    }

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
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.SET_SCENARIO, scenario);
      return;
    }

    setState((prev) => ({ ...prev, activeScenario: scenario, scenarioResult: null }));
  };

  const clearRunHistory = () => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.CLEAR_RUN_HISTORY);
      return;
    }

    resetRuns();
    setRuns([]);
  };

  const togglePause = () => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.TOGGLE_PAUSE);
      return;
    }

    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const setSimulationSpeed = (speed) => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.SET_SIMULATION_SPEED, speed);
      return;
    }

    setState((prev) => ({ ...prev, simulationSpeed: speed }));
  };

  const stepOnce = () => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.STEP_ONCE);
      return;
    }

    setState((prev) => ({ ...prev, stepRequested: true, isPaused: true }));
  };

  const clearSession = () => {
    if (!isEngineAuthority) {
      SimulationBridge.broadcastCommand(COMMAND_TYPES.CLEAR_SESSION);
      return;
    }

    clearSessionFromStorage();
    resetLogger();
    setState({ ...initialState });
  };

  actionsRef.current = {
    startCountdown,
    resetSimulation,
    applySettings,
    setScenario,
    clearRunHistory,
    clearSession,
    togglePause,
    setSimulationSpeed,
    stepOnce
  };

  const engineConnected = isEngineAuthority
    ? true
    : Boolean(
      connectionStatus.connected &&
      connectionStatus.lastSnapshotAt &&
      now - connectionStatus.lastSnapshotAt < SNAPSHOT_STALE_MS
    );

  return {
    state,
    isHUDMode,
    hostRole,
    transportType: runtime.transportType,
    relayUrl: runtime.relayUrl,
    sessionId: runtime.sessionId,
    connection: {
      transportConnected: connectionStatus.connected,
      engineConnected,
      lastSnapshotAt: connectionStatus.lastSnapshotAt
    },
    startCountdown,
    resetSimulation,
    applySettings,
    setScenario,
    clearRunHistory,
    clearSession,
    history,
    events: state.events || [],
    runs,
    activeScenario: state.activeScenario,
    scenarioResult: state.scenarioResult,
    togglePause,
    setSimulationSpeed,
    stepOnce,
    analysis: analyzeFlight(history)
  };
}

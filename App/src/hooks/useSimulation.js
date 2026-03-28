import React, { useEffect, useRef, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger, getHistory } from "../simulation/telemetry/dataLogger";

export function useSimulation() {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([]);

  const historyTickRef = useRef(0);
  const HISTORY_UPDATE_EVERY = 30; // 60fps / 30 = ~2 updates per second

  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      setState((prev) => stepSimulation(prev));

      // UI/Chart refresh: don't sync history every frame to avoid performance hits
      historyTickRef.current += 1;
      if (historyTickRef.current % HISTORY_UPDATE_EVERY === 0) {
        setHistory(getHistory());
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState((prev) => ({
      ...initialState,
      fuel: settings.fuel,
      mass: settings.mass,
      thrust: settings.thrust,
      burnRate: settings.burnRate,
      dragCoefficient: settings.dragCoefficient
    }));
  };

  return {
    state,
    startCountdown,
    resetSimulation,
    applySettings,
    history: history,
    events: state.events || []
  };
}
import { useEffect, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger } from "../simulation/telemetry/dataLogger";

export function useSimulation() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      setState((prev) => stepSimulation(prev));
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const startCountdown = () => {
    setState((prev) => {
      if (prev.state !== "idle" && prev.state !== "landed") {
        return prev;
      }

      return {
        ...prev,
        state: "countdown",
        countdown: 5
      };
    });
  };

  const resetSimulation = () => {
    resetLogger();
    setState(initialState);
  };

  const applySettings = (settings) => {
    resetLogger();

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
    history: state.history || [],
    events: state.events || [],
  };
}
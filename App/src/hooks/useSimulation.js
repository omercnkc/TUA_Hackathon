// src/hooks/useSimulation.js
// history artık React state dışında tutuluyor.
// Sadece chart render'ı için periyodik olarak getHistory() çağrılır.

import { useEffect, useRef, useState } from "react";
import { initialState } from "../simulation/core/simulationState";
import { stepSimulation } from "../simulation/core/simulationLoop";
import { resetLogger, getHistory } from "../simulation/telemery/dataLogger";

export function useSimulation() {
  const [state, setState] = useState(initialState);

  // history'yi ayrı bir ref ile tut → React state'e dahil etme
  const [history, setHistory] = useState([]);

  const historyTickRef = useRef(0);
  const HISTORY_UPDATE_EVERY = 30; // Her 30 RAF frame'de bir history'yi UI'ya yansıt (~2/sn)

  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      setState(prev => stepSimulation(prev));

      // Chart'ı çok sık güncelleme — sadece her 30 frame'de
      historyTickRef.current += 1;
      if (historyTickRef.current % HISTORY_UPDATE_EVERY === 0) {
        setHistory(getHistory()); // kopya alır (getHistory slice yapıyor)
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
    setState({
      ...initialState,
      state: "countdown",
      countdown: 5,
      launchStartTime: null,
    });
  };

  const resetSimulation = () => {
    resetLogger();
    historyTickRef.current = 0;
    setHistory([]);
    setState(initialState);
  };

  return { state, startCountdown, resetSimulation, history };
}
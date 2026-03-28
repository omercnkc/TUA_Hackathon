import Scene from "./components/Scene";
import { useSimulation } from "./hooks/useSimulation";
import { analyzeFlight } from "./simulation/telemetry/analysis";
import FlightDashboard from "./ui/FlightDashboard";
import ControlPanel from "./ui/ControlPanel";

function App() {
  const {
    state,
    startCountdown,
    resetSimulation,
    applySettings,
    history
  } = useSimulation();

  const analysis = analyzeFlight(history);

  return (
    <>
      <div style={{ padding: "16px" }}>
        <button onClick={startCountdown} style={{ marginRight: "8px" }}>
          Start Countdown
        </button>

        <button onClick={resetSimulation}>Reset</button>
      </div>

      <ControlPanel
        state={state}
        onApplySettings={applySettings}
        onSelectPreset={applySettings}
      />

      <FlightDashboard
        state={state}
        analysis={analysis}
        history={history}
      />

      <div style={{ height: "600px" }}>
        <Scene height={state.height} />
      </div>
    </>
  );
}

export default App;
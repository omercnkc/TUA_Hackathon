import Scene from "./components/Scene";
import { useSimulation } from "./hooks/useSimulation";
import { analyzeFlight } from "./simulation/telemery/analysis";
import FlightDashboard from "./ui/FlightDashboard";

function App() {
  const { state, startCountdown, resetSimulation, history } = useSimulation();

  const analysis = analyzeFlight(history);

  return (
    <>
      <div style={{ padding: "16px" }}>
        <button onClick={startCountdown} style={{ marginRight: "8px" }}>
          Start Countdown
        </button>

        <button onClick={resetSimulation}>Reset</button>
      </div>

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
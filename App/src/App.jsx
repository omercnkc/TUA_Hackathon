import React from "react";
import Scene from "./components/Scene";
import { useSimulation } from "./hooks/useSimulation";
import { analyzeFlight } from "./simulation/telemetry/analysis";
import FlightDashboard from "./ui/FlightDashboard";
import ControlPanel from "./ui/ControlPanel";
import EventSummary from "./ui/EventSummary";
import ComparisonDashboard from "./ui/ComparisonDashboard";
import ScenarioPanel from "./ui/ScenarioPanel";
import ScenarioResult from "./ui/ScenarioResult";
import SimulationControls from "./ui/SimulationControls";
import { convertHistoryToCSV, downloadCSV } from "./simulation/export/csvExport";
import { buildFlightReport } from "./simulation/export/flightReport";

function App() {
  const {
    state,
    startCountdown,
    resetSimulation,
    applySettings,
    setScenario,
    clearRunHistory,
    history,
    events,
    runs,
    activeScenario,
    scenarioResult,
    togglePause,
    setSimulationSpeed,
    stepOnce
  } = useSimulation();

  const analysis = analyzeFlight(history);
  const report = buildFlightReport({
    analysis,
    events,
    state
  });

  const handleExportCSV = () => {
    const csvContent = convertHistoryToCSV(history);
    downloadCSV("flight-history.csv", csvContent);
  };

  return (
    <>
      <div style={{ padding: "16px" }}>
        <button onClick={startCountdown} style={{ marginRight: "8px" }}>
          Start Countdown
        </button>

        <button onClick={resetSimulation} style={{ marginRight: "8px" }}>
          Reset
        </button>

        <button onClick={handleExportCSV} style={{ marginRight: "8px" }}>
          Export CSV
        </button>

        <button onClick={clearRunHistory}>
          Clear Run History
        </button>
      </div>

      <ControlPanel
        state={state}
        onApplySettings={applySettings}
        onSelectPreset={applySettings}
      />

      <SimulationControls
        isPaused={state.isPaused}
        simulationSpeed={state.simulationSpeed}
        onTogglePause={togglePause}
        onStepOnce={stepOnce}
        onChangeSpeed={setSimulationSpeed}
      />

      <ScenarioPanel
        activeScenario={activeScenario}
        onSelectScenario={setScenario}
      />

      <FlightDashboard
        state={state}
        analysis={analysis}
        history={history}
        events={events} // passing events explicitly just in case
      />

      <EventSummary
        report={report}
        events={events}
      />

      <ScenarioResult result={scenarioResult} />

      <ComparisonDashboard runs={runs} />

      <div style={{ height: "600px" }}>
        <Scene height={state.height} />
      </div>
    </>
  );
}

export default App;
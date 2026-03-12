// Components
import EvCalculatorWrapper from "../features/EvCalculator/EvCalculatorWrapper";
import TeamArea from "../features/TeamArea/TeamArea.jsx";

// Import context

function EvCalcPage({
  smogonPkmnPool,
  isResultCalculated,
  updateAirTable,
  updateTitle,
}) {
  return (
    <>
      <EvCalculatorWrapper
        smogonPkmnPool={smogonPkmnPool}
        isResultCalculated={isResultCalculated}
        updateAirTable={updateAirTable}
      />
      <TeamArea updateAirTable={updateAirTable} updateTitle={updateTitle} />
    </>
  );
}

export default EvCalcPage;

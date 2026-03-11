// Components
import EvCalculatorWrapper from "../features/EvCalculator/EvCalculatorWrapper";
import TeamArea from "../features/TeamArea/TeamArea.jsx";

// Import context

function EvCalcPage({ smogonPkmnPool, isResultCalculated }) {
  return (
    <>
      <EvCalculatorWrapper
        smogonPkmnPool={smogonPkmnPool}
        isResultCalculated={isResultCalculated}
      />
      <TeamArea />
    </>
  );
}

export default EvCalcPage;

import EvCalculatorWrapper from "../features/EvCalculator/EvCalculatorWrapper";

// Import context

function EvCalcPage({ smogonPkmnPool, isResultCalculated }) {
  return (
    <EvCalculatorWrapper
      smogonPkmnPool={smogonPkmnPool}
      isResultCalculated={isResultCalculated}
    />
  );
}

export default EvCalcPage;

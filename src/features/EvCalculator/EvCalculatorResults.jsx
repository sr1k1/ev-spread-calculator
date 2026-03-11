function EvCalculatorResults({ finalEvSpread }) {
  return (
    <div>
      <p>Target found! Time to use computeEvSpread</p>
      <p>{JSON.stringify(finalEvSpread)}</p>
    </div>
  );
}

export default EvCalculatorResults;

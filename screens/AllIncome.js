import { useContext } from "react";

import IncomeOutput from "../components/IncomeOutput/IncomeOutput";
import { IncomeContext } from "../store/income-context";

function AllIncome() {
  const incomeCtx = useContext(IncomeContext);
  return (
    <IncomeOutput
      income={incomeCtx.income}
      incomePeriod="Total"
      screen="All Income"
      fallbackText="No registered income found!"
    />
  );
}

export default AllIncome;

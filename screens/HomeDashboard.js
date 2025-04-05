import React, { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { WalletContext } from "../store/wallet-context";
import { ExpensesContext } from "../store/expenses-context";
import { getFormattedDate } from "../util/date";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import { fetchTotalExpenses } from "../util/http";
import { fetchWallet } from "../util/http";
import { Alert } from "react-native";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import MainWallet from "../components/Wallet/MainWallet";

function HomeDashboard() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const expensesCtx = useContext(ExpensesContext);
  const walletCtx = useContext(WalletContext);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      }
      setIsFetching(false);
    }

    getExpenses();

    async function getWallets() {
      setIsFetching(true);
      try {
        const wallets = await fetchWallet();
        walletCtx.setWallet(wallets);
      } catch (error) {
        setError("Could not fetch wallets!");
      }
      setIsFetching(false);
    }

    getWallets();

    async function getTotalExpenses() {
      setIsFetching(true);
      try {
        const totalExpenses = await fetchTotalExpenses();
        expensesCtx.setTotalExpenses(totalExpenses[0].totalAmount);
      } catch (error) {
        setError("Could not fetch expenses!");
      }
      setIsFetching(false);
    }

    getTotalExpenses();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    const expenseDate = new Date(expense.date);

    return expenseDate >= date7DaysAgo && expenseDate <= today;
  });

  return (
    <React.Fragment>
      <MainWallet
        wallets={walletCtx.wallets}
        totalExpensesAmount={expensesCtx.totalExpenses}
      />
      <ExpensesOutput
        expenses={recentExpenses}
        screen="Recent Expenses"
        expensesPeriod="Last 7 Days"
        fallbackText="No expenses registered for the last 7 days."
      />
    </React.Fragment>
  );
}

export default HomeDashboard;

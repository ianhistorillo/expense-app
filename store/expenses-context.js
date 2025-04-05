import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  totalExpenses: 0, // This should be a number, not an array.
  addExpense: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  setTotalExpenses: (totalExpenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case "SET":
      const inverted = action.payload.reverse();
      return { ...state, expenses: inverted };
    case "SET_TOTAL":
      return { ...state, totalExpenses: action.payload }; // Store totalExpenses directly
    case "UPDATE":
      const updatableExpenseIndex = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state.expenses[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state.expenses];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return { ...state, expenses: updatedExpenses };
    case "DELETE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, {
    expenses: [],
    totalExpenses: 0, // Initialize totalExpenses as 0.
  });

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function setTotalExpenses(totalExpenses) {
    dispatch({ type: "SET_TOTAL", payload: totalExpenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState.expenses,
    totalExpenses: expensesState.totalExpenses, // Access totalExpenses from state
    setExpenses: setExpenses,
    setTotalExpenses: setTotalExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
    dispatch,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;

import { FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function ExpensesList({ expenses }) {
  // Use FlatList's renderItem and pass index to determine the last item
  function renderExpenseItem(itemData) {
    const index = itemData.index; // Get the index of the current item
    return (
      <ExpenseItem
        key={itemData.item.id}
        isLast={index === expenses.length - 1} // Pass true for last item
        {...itemData.item} // Spread the expense data
      />
    );
  }

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;

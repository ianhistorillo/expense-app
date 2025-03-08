import { FlatList } from "react-native";

import ExpenseItem from "./ExpenseItem";
import { getFormattedDate } from "../../util/date";

function renderExpenseItem(itemData) {
  return <ExpenseItem {...itemData.item} />;
}

function ExpensesList({ expenses }) {
  // Convert array of arrays into an array of objects

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;

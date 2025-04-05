import { StyleSheet, Text, View } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import ExpensesList from "./ExpensesList";
import ExpensesSummary from "./ExpensesSummary";

function ExpensesOutput({ expenses, expensesPeriod, screen, fallbackText }) {
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {" "}
        <Text style={styles.title}> {screen} </Text>{" "}
      </View>

      {/* <ExpensesSummary expenses={expenses} periodName={expensesPeriod} /> */}
      {content}
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary10,
  },
  titleContainer: {
    backgroundColor: GlobalStyles.colors.white,
    borderRadius: 15,
    marginTop: 12,
    marginBottom: 24,
    padding: 15,
  },
  infoText: {
    color: GlobalStyles.colors.black,
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  title: {
    color: GlobalStyles.colors.black,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
});

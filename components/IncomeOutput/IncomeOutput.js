import { StyleSheet, Text, View } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import IncomeList from "./IncomeList";
import IncomeSummary from "./IncomeSummary";

function IncomeOutput({ income, incomePeriod, screen, fallbackText }) {
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;
  console.log("income? ", income);
  if (income.length > 0) {
    content = <IncomeList income={income} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {screen} </Text>
      {/* <ExpensesSummary expenses={expenses} periodName={expensesPeriod} /> */}
      {content}
    </View>
  );
}

export default IncomeOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 32,
    marginBottom: 24,
  },
});

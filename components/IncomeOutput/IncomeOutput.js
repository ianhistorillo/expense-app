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
      <View style={styles.titleContainer}>
        <Text style={styles.title}> {screen} </Text>
      </View>
      <View style={styles.listContainer}>
        {/* <ExpensesSummary expenses={expenses} periodName={expensesPeriod} /> */}
        {content}
      </View>
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
  listContainer: {
    backgroundColor: GlobalStyles.colors.primary30,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 20,
  },
});

import { StyleSheet, Text, View } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import WalletList from "./WalletList";

function WalletsOutput({ wallets }) {
  let content = (
    <Text style={styles.infoText}>No wallet found. Please add a wallet</Text>
  );

  if (wallets.length > 0) {
    content = <WalletList wallets={wallets} />;
  }

  return (
    <View style={styles.container}>
      {/* <ExpensesSummary expenses={expenses} periodName={expensesPeriod} /> */}
      {content}
    </View>
  );
}

export default WalletsOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary10,
  },
  infoText: {
    color: GlobalStyles.colors.black,
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
});

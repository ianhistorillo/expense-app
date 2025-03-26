import { View, Text, StyleSheet } from "react-native";

import { GlobalStyles } from "../../constants/styles";

function MainWallet() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.walletContainer}>
        <Text style={styles.walletMainText}> Current Balance </Text>
        <Text style={styles.walletAmount}> ₱ 1,000.00</Text>
      </View>
    </View>
  );
}

export default MainWallet;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  walletContainer: {
    padding: 15,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  walletMainText: {
    fontSize: 15,
    color: GlobalStyles.colors.primary400,
  },
  walletAmount: {
    fontSize: 25,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});

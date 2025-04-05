import { View, Text, StyleSheet } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../UI/IconButton";

import ManageWallet from "../../screens/ManageWallet";
import ManageExpenses from "../../screens/ManageExpenses";
import ManageIncome from "../../screens/ManageIncome";

function MainWallet({ wallets, totalExpensesAmount }) {
  const navigation = useNavigation();
  const mainWallet = wallets.filter(
    (wallet) => wallet.showToDashboard === "Yes"
  );

  let formattedBudget = 0;
  let totalExpenses = 0;
  let startCutoff = "";
  let endCutoff = "";

  if (mainWallet.length > 0) {
    // Format the budget with commas and PHP sign
    formattedBudget = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(mainWallet[0].budget);

    totalExpensesAmount = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(totalExpensesAmount);

    const sc = new Date(mainWallet[0].startCutoff);
    const ec = new Date(mainWallet[0].endCutoff);

    // Format the date using toLocaleDateString
    startCutoff = sc.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the date using toLocaleDateString
    endCutoff = ec.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (mainWallet.length > 0) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.walletContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.walletMainText}> Balance</Text>
            <Text style={styles.walletAmount}> {formattedBudget} </Text>
          </View>
          <View style={styles.addExpenseContainer}>
            <View style={styles.expenseContainerIcon}>
              <IconButton
                icon="add-outline"
                size={30}
                type="dashboardIcon"
                color={GlobalStyles.colors.primary400}
                onPress={() => {
                  navigation.navigate("ManageIncome");
                }}
              />
              <Text style={styles.walletMainText}> Income </Text>
            </View>

            <View style={styles.expenseContainerIcon}>
              <IconButton
                icon="navigate-outline"
                size={30}
                type="dashboardIcon"
                color={GlobalStyles.colors.primary400}
                onPress={() => {
                  navigation.navigate("ManageExpenses");
                }}
              />

              <Text style={styles.walletMainText}> Expenses </Text>
            </View>
            <View style={styles.expenseContainerIcon}>
              <IconButton
                icon="eye-outline"
                size={30}
                type="dashboardIcon"
                color={GlobalStyles.colors.primary400}
                onPress={() => {
                  navigation.navigate("ManageExpenses");
                }}
              />

              <Text style={styles.walletMainText}> View </Text>
            </View>
          </View>

          <View style={styles.statementDateContainer}>
            <Text style={styles.statementText}>
              {" "}
              {startCutoff} to {endCutoff}{" "}
            </Text>
            <Text style={[styles.statementText, styles.statementTextTotal]}>
              {" "}
              TOTAL: {totalExpensesAmount}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.walletContainer}>
          <View style={[styles.textContainer, styles.noWallet]}>
            <Text style={styles.noWalletMainText}>
              No Existing Wallet. Please add.
            </Text>
          </View>
          <View style={styles.addExpenseContainer}>
            <IconButton
              icon="add-circle-outline"
              size={40}
              color={GlobalStyles.colors.primary400}
              onPress={() => {
                navigation.navigate("ManageWallet");
              }}
            />
          </View>
          {/* <Text style={styles.walletMainText}> Statement Date: </Text>
        <Text style={styles.walletMainText}>
          {" "}
          {startCutoff} to {endCutoff}{" "}
        </Text> */}
        </View>
      </View>
    );
  }
}

export default MainWallet;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
    width: "100%",
  },
  walletContainer: {
    padding: 15,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 25,
    flexDirection: "row wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statementDateContainer: {
    backgroundColor: GlobalStyles.colors.primary200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    width: "100%",
  },
  statementText: {
    fontSize: 11,
    color: GlobalStyles.colors.primary50,
  },
  statementTextTotal: {
    fontWeight: "bold",
    color: GlobalStyles.colors.error200,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  addExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20",
    marginBottom: "20",
    gap: "20",
  },
  expenseContainerIcon: {
    justifyContent: "center",
    alignItems: "center",
    gap: "10",
  },
  walletMainText: {
    fontSize: 10,
    color: GlobalStyles.colors.primary400,
    marginBottom: 10,
    textAlign: "center",
  },
  noWalletMainText: {
    fontSize: 15,
    color: GlobalStyles.colors.primary400,
    marginBottom: 10,
  },
  noWallet: {
    fontSize: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  walletAmount: {
    fontSize: 35,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});

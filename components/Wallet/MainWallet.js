import { View, Text, StyleSheet } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../UI/IconButton";

import ManageWallet from "../../screens/ManageWallet";
import ManageExpenses from "../../screens/ManageExpenses";

function MainWallet({ wallets }) {
  const navigation = useNavigation();
  const mainWallet = wallets.filter(
    (wallet) => wallet.showToDashboard === "Yes"
  );

  let formattedBudget = 0;

  if (mainWallet.length > 0) {
    // Format the budget with commas and PHP sign
    formattedBudget = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(mainWallet[0].budget);

    const sc = new Date(mainWallet[0].startCutoff);
    const ec = new Date(mainWallet[0].endCutoff);

    // Format the date using toLocaleDateString
    const startCutoff = sc.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the date using toLocaleDateString
    const endCutoff = ec.toLocaleDateString("en-US", {
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
            <Text style={styles.walletMainText}>
              {" "}
              Available {mainWallet[0].name} Balance{" "}
            </Text>
            <Text style={styles.walletAmount}> {formattedBudget} </Text>
          </View>
          <View style={styles.addExpenseContainer}>
            <IconButton
              icon="add-circle-outline"
              size={40}
              color={GlobalStyles.colors.primary400}
              onPress={() => {
                navigation.navigate("ManageExpenses");
              }}
            />
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
  },
  walletContainer: {
    padding: 15,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  addExpenseContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  walletMainText: {
    fontSize: 10,
    color: GlobalStyles.colors.primary400,
    marginBottom: 10,
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
    fontSize: 30,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});

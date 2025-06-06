import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";

function WalletItem({
  name,
  type,
  budget,
  startCutoff,
  endCutoff,
  showToDashboard,
  id,
}) {
  const navigation = useNavigation();

  function walletPressHandler() {
    navigation.navigate("ManageWallet", {
      walletId: id,
    });
  }

  // Format the budget with commas and PHP sign
  const formattedBudget = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(budget);

  return (
    <Pressable
      onPress={walletPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.walletItem}>
        <View>
          <Text style={[styles.textBase, styles.description]}>{name}</Text>
          <Text style={styles.textBase}>{type}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formattedBudget}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default WalletItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  walletItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 15,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.black,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: GlobalStyles.colors.primary10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.black,
    fontWeight: "bold",
  },
});

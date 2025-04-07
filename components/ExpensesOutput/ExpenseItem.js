import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";
import IconButton from "../UI/IconButton";

function ExpenseItem({ amount, type, description, date, id, isLast }) {
  const navigation = useNavigation();

  console.log("Type? ", type);

  function expensePressHandler() {
    navigation.navigate("ManageExpenses", {
      expenseId: id,
    });
  }

  const formattedAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

  const dd = new Date(getFormattedDate(date));

  const dateFormat = dd.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mapping of types to icons
  const typeToIconMap = {
    Food: "pizza-outline",
    Gasoline: "car-outline",
    "Online Shopping": "cart-outline",
    Games: "game-controller-outline",
    Subscription: "cloud-outline",
    Utilities: "flash-outline",
    "Loan Payments": "wallet-outline",
    "Credit Card Payments": "wallet-outline",
    Health: "medkit-outline",
    "Family Allowance": "logo-usd",
    Others: "build-outline",
  };

  // Function to get the icon based on the type
  const getIconForType = (type) => {
    return typeToIconMap[type] || "default-icon"; // "default-icon" is a fallback if type is not found
  };

  return (
    <Pressable
      onPress={expensePressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.expenseItem, isLast ? styles.noBorder : null]}>
        <View style={styles.expenseContainerIcon}>
          <IconButton
            icon={getIconForType(type)}
            size={15}
            type="itemIcon"
            color={GlobalStyles.colors.black}
          />
        </View>
        <View style={styles.descStyle}>
          <Text style={[styles.textBase, styles.description]}>{type}</Text>
          <Text style={styles.textBase}>{dateFormat}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formattedAmount}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ExpenseItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  expenseContainerIcon: {
    width: "11%",
  },
  expenseItem: {
    padding: 20,
    marginVertical: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 15,
    elevation: 31,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.primary10,
  },
  descStyle: {
    width: "45%",
    textAlign: "left",
  },
  noBorder: {
    borderBottomWidth: 0,
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
    width: "35%",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: GlobalStyles.colors.primary10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.black,
    fontWeight: "bold",
  },
});

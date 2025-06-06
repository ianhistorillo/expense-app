import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";

function IncomeItem({ amount, type, description, date, id }) {
  const navigation = useNavigation();

  function incomePressHandler() {
    navigation.navigate("ManageIncome", {
      incomeId: id,
    });
  }

  // Format the budget with commas and PHP sign
  const formattedAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

  const dd = new Date(getFormattedDate(date));

  // Format the date using toLocaleDateString
  const dateFormat = dd.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={incomePressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.incomeItem}>
        <View>
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

export default IncomeItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  incomeItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary30,
    flexDirection: "row",
    justifyContent: "space-between",
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

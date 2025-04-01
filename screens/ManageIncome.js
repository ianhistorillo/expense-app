import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { IncomeContext } from "../store/income-context";
import { WalletContext } from "../store/wallet-context";
import IncomeForm from "../components/ManageIncome/IncomeForm";
import { deleteIncome, storeIncome, updateIncome } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageIncome({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const incomeCtx = useContext(IncomeContext);
  const { dispatch } = useContext(WalletContext); // Get dispatch from context

  const editedIncomeId = route.params?.incomeId;
  const isEditing = !!editedIncomeId;

  const selectedIncome = incomeCtx.income.find(
    (income) => income.id === editedIncomeId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Income" : "Add Income",
    });
  }, [navigation, isEditing]);

  async function deleteIncomeHandler() {
    setIsSubmitting(true);
    try {
      await deleteIncome(editedIncomeId);
      incomeCtx.deleteIncome(editedIncomeId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later!");
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(incomeData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        incomeCtx.updateIncome(editedIncomeId, incomeData);
        await updateIncome(editedIncomeId, incomeData);
      } else {
        const id = await storeIncome(incomeData, dispatch);
        incomeCtx.addIncome({ ...incomeData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <IncomeForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedIncome}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteIncomeHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageIncome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});

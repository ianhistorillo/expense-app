import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { WalletContext } from "../store/wallet-context";
import WalletForm from "../components/ManageWallet/WalletForm";
import { deleteWallet, storeWallet, updateWallet } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageWallet({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const walletCtx = useContext(WalletContext);
  const { dispatch } = useContext(WalletContext); // Get dispatch from context

  const editedWalletId = route.params?.walletId;
  const isEditing = !!editedWalletId;

  const selectedWallet = walletCtx.wallets.find(
    (wallet) => wallet.id === editedWalletId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Wallet" : "Add Wallet",
    });
  }, [navigation, isEditing]);

  async function deleteWalletHandler() {
    setIsSubmitting(true);
    try {
      await deleteWallet(editedWalletId);
      walletCtx.deleteWallet(editedWalletId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete wallet - please try again later!");
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(walletData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        walletCtx.updateWallet(editedWalletId, walletData);
        await updateWallet(editedWalletId, walletData);
      } else {
        const id = await storeWallet(walletData, dispatch);
        walletCtx.addWallet({ ...walletData, id: id });
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
      <WalletForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedWallet}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteWalletHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary10,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});

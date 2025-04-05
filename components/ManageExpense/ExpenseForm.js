import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
} from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PaperProvider } from "react-native-paper";
import { WalletContext } from "../../store/wallet-context";

//data
import { fetchWallet } from "../../util/http";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  const walletCtx = useContext(WalletContext);

  useEffect(() => {
    async function getWallets() {
      setIsFetching(true);
      try {
        const wallets = await fetchWallet();
        walletCtx.setWallet(wallets);
      } catch (error) {
        setError("Could not fetch wallets!");
      }
      setIsFetching(false);
    }

    getWallets();
  }, []);

  // State initialization
  const [inputs, setInputs] = useState({
    amount: {
      value: "",
      isValid: true,
    },
    date: {
      value: "",
      isValid: true,
    },
    description: {
      value: "",
      isValid: true,
    },
    type: {
      value: "",
      isValid: true,
    },
    wallet: {
      value: "",
      isValid: true,
    },
  });

  // State for Date Picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State for handling the Type dropdown
  const [isTypeMenuVisible, setIsTypeMenuVisible] = useState(false);

  // State for handling the Type dropdown
  const [isWalletMenuVisible, setIsWalletMenuVisible] = useState(false);

  const [selectedWalletId, setSelectedWalletId] = useState("");

  // Menu items for the Type selection
  const typeOptions = [
    { id: "1", name: "Food" },
    { id: "2", name: "Gasoline" },
    { id: "3", name: "Online Shopping" },
    { id: "4", name: "Games" },
    { id: "5", name: "Subscription" },
    { id: "6", name: "Utilities" },
    { id: "7", name: "Loan Payments" },
    { id: "8", name: "Credit Card Payments" },
    { id: "9", name: "Health" },
    { id: "10", name: "Family Allowance" },
    { id: "11", name: "Others" },
  ];

  const walletOptions = walletCtx.wallets;

  // UseEffect to handle when defaultValues change (for editing existing data)
  useEffect(() => {
    if (defaultValues) {
      setInputs({
        amount: {
          value: defaultValues.amount ? defaultValues.amount.toString() : "",
          isValid: true,
        },
        date: {
          value: defaultValues.date ? getFormattedDate(defaultValues.date) : "",
          isValid: true,
        },
        description: {
          value: defaultValues.description || "",
          isValid: true,
        },
        type: {
          value: defaultValues.type ? defaultValues.type.toString() : "",
          isValid: true,
        },
        wallet: {
          value: defaultValues.wallet ? defaultValues.wallet.toString() : "",
          isValid: true,
        },
      });
    }
  }, [defaultValues]);

  // Input change handler
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      if (curInputs[inputIdentifier].value !== enteredValue) {
        return {
          ...curInputs,
          [inputIdentifier]: { value: enteredValue, isValid: true },
        };
      }
      return curInputs;
    });
  }

  // Form submission handler
  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
      type: inputs.type.value,
      wallet: selectedWalletId,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    const typeIsValid = expenseData.type;
    const walletIsValid = expenseData.wallet;

    if (
      !amountIsValid ||
      !dateIsValid ||
      !descriptionIsValid ||
      !typeIsValid ||
      !walletIsValid
    ) {
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
          type: { value: curInputs.type.value, isValid: typeIsValid },
          wallet: { value: curInputs.wallet.value, isValid: walletIsValid },
        };
      });
      return;
    }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid ||
    !inputs.type.isValid;
  !inputs.wallet.isValid;

  // Date change handler
  const dateChangeHandler = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker after selecting a date
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      inputChangedHandler("date", getFormattedDate(currentDate));
    }
  };

  // Toggle date picker visibility
  const showDatepickerHandler = () => {
    setShowDatePicker(true); // Show the date picker when the input is pressed
  };

  // Show or hide the type selection menu
  const toggleTypeMenu = () => {
    setIsTypeMenuVisible((prev) => !prev);
  };

  // Select a type from the menu
  const selectTypeHandler = (type) => {
    inputChangedHandler("type", type);
    toggleTypeMenu();
  };

  // Show or hide the wallet selection menu
  const toggleWalletMenu = () => {
    setIsWalletMenuVisible((prev) => !prev);
  };

  // Select a wallet from the menu
  const selectWalletHandler = (walletId) => {
    const selectedWallet = walletOptions.find(
      (wallet) => wallet.id === walletId
    );

    if (selectedWallet) {
      inputChangedHandler("wallet", selectedWallet.name); // Store the name for display
      setSelectedWalletId(selectedWallet.id); // Store the id for submission
    }
    toggleWalletMenu();
  };

  return (
    <PaperProvider>
      <View style={styles.form}>
        <Text style={styles.title}>Your Expense</Text>
        <View style={styles.inputsRow}>
          <Input
            style={styles.rowInput}
            label="Amount"
            invalid={!inputs.amount.isValid}
            textInputConfig={{
              keyboardType: "decimal-pad",
              onChangeText: inputChangedHandler.bind(this, "amount"),
              value: inputs.amount.value,
            }}
          />
          <View style={styles.rowInput}>
            <TouchableWithoutFeedback onPress={showDatepickerHandler}>
              <View style={styles.dateInputContainer}>
                <Input
                  style={styles.rowInput}
                  label="Date"
                  invalid={!inputs.date.isValid}
                  textInputConfig={{
                    placeholder: "Select Date",
                    maxLength: 10,
                    editable: false, // Make it non-editable
                    value: inputs.date.value,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(inputs.date.value || Date.now())}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={dateChangeHandler}
              />
            )}
          </View>
        </View>
        <View style={styles.inputsRow}>
          <TouchableWithoutFeedback onPress={toggleTypeMenu}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                label="Type"
                invalid={!inputs.type.isValid}
                textInputConfig={{
                  placeholder: "Ex. Food",
                  editable: false, // Make it non-editable to act like a select box
                  value: inputs.type.value || "Select Type",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {isTypeMenuVisible && (
            <Modal
              transparent={true}
              visible={isTypeMenuVisible}
              animationType="fade"
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.typeMenu}>
                  {typeOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => selectTypeHandler(item.name)}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          )}
        </View>
        <View style={styles.inputsRow}>
          <TouchableWithoutFeedback onPress={toggleWalletMenu}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                label="Wallet"
                invalid={!inputs.wallet.isValid}
                textInputConfig={{
                  editable: false, // Make it non-editable to act like a select box
                  value: inputs.wallet.value || "Select Target Wallet",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {isWalletMenuVisible && (
            <Modal
              transparent={true}
              visible={isWalletMenuVisible}
              animationType="fade"
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.typeMenu}>
                  {walletOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => selectWalletHandler(item.id)}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          )}
        </View>
        <View style={styles.inputsRow}>
          <Input
            label="Description"
            invalid={!inputs.description.isValid}
            textInputConfig={{
              multiline: true,
              onChangeText: inputChangedHandler.bind(this, "description"),
              value: inputs.description.value,
            }}
          />
        </View>
        {formIsInvalid && (
          <Text style={styles.errorText}>
            Invalid input values - please check your entered data!
          </Text>
        )}
        <View style={styles.buttons}>
          <Button style={styles.button} mode="flat" onPress={onCancel}>
            Cancel
          </Button>
          <Button style={styles.button} onPress={submitHandler}>
            {submitButtonLabel}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.black,
    marginVertical: 14,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rowInput: {
    flex: 1,
  },
  typeInput: {
    flex: 1,
    justifyContent: "center",
  },
  dateInputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  dateLabel: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  typeMenu: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    width: "90%", // Adjust width to match the input fields
    maxWidth: 400, // Ensure it doesn't grow too wide
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

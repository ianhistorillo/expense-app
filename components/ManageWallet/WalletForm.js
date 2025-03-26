import { useEffect, useState } from "react";
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

function WalletForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  // State initialization
  const [inputs, setInputs] = useState({
    name: {
      value: "",
      isValid: true,
    },
    type: {
      value: "",
      isValid: true,
    },
    budget: {
      value: "",
      isValid: true,
    },
    startCutoff: {
      value: "",
      isValid: true,
    },
    endCutoff: {
      value: "",
      isValid: true,
    },
    showToDashboard: {
      value: "",
      isValid: true,
    },
  });

  // State for Date Picker visibility
  const [showSCDatePicker, setSCShowDatePicker] = useState(false);

  // State for Date Picker visibility
  const [showECDatePicker, setECShowDatePicker] = useState(false);

  // State for handling the Type dropdown
  const [isTypeMenuVisible, setIsTypeMenuVisible] = useState(false);

  // State for handling the Type dropdown
  const [isSDMenuVisible, setIsSDMenuVisible] = useState(false);

  // Menu items for the Type selection
  const typeOptions = [
    { id: "1", name: "Credit Card" },
    { id: "2", name: "Debit Card" },
    { id: "3", name: "Savings Account" },
    { id: "4", name: "Temporary Account" },
    { id: "5", name: "Others" },
  ];

  // Menu items for the Type selection
  const mainWalletOptions = [
    { id: "1", name: "Yes" },
    { id: "2", name: "No" },
  ];

  // UseEffect to handle when defaultValues change (for editing existing data)
  useEffect(() => {
    if (defaultValues) {
      setInputs({
        name: {
          value: defaultValues.name ? defaultValues.name.toString() : "",
          isValid: true,
        },
        type: {
          value: defaultValues.type || "",
          isValid: true,
        },
        budget: {
          value: defaultValues.budget || "",
          isValid: true,
        },
        startCutoff: {
          value: defaultValues.startCutoff
            ? getFormattedDate(defaultValues.startCutoff)
            : "",
          isValid: true,
        },
        endCutoff: {
          value: defaultValues.endCutoff
            ? getFormattedDate(defaultValues.endCutoff)
            : "",
          isValid: true,
        },
        showToDashboard: {
          value: defaultValues.showToDashboard || "",
          isValid: true,
        },
      });
    }
  }, [defaultValues]);

  // Input change handler
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  // Form submission handler
  function submitHandler() {
    const walletData = {
      name: inputs.name.value,
      type: inputs.type.value,
      budget: inputs.budget.value,
      startCutoff: new Date(inputs.startCutoff.value),
      endCutoff: new Date(inputs.endCutoff.value),
      showToDashboard: inputs.showToDashboard.value,
    };

    const nameIsValid = walletData.name;
    const typeIsValid = walletData.type;
    const budgetIsValid = !isNaN(walletData.budget) && walletData.budget > 0;
    const startCutoffIsValid =
      walletData.startCutoff.toString() !== "Invalid Date";
    const endCutoffIsValid = walletData.endCutoff.toString() !== "Invalid Date";
    const showToDashboardIsValid = walletData.showToDashboard;

    if (
      !nameIsValid ||
      !typeIsValid ||
      !budgetIsValid ||
      !startCutoffIsValid ||
      !endCutoffIsValid ||
      !showToDashboardIsValid
    ) {
      setInputs((curInputs) => {
        return {
          name: { value: curInputs.name.value, isValid: nameIsValid },
          type: { value: curInputs.type.value, isValid: typeIsValid },
          budget: { value: curInputs.budget.value, isValid: budgetIsValid },
          startCutoff: {
            value: curInputs.startCutoff.value,
            isValid: startCutoffIsValid,
          },
          endCutoff: {
            value: curInputs.endCutoff.value,
            isValid: endCutoffIsValid,
          },
          showToDashboard: {
            value: curInputs.showToDashboard.value,
            isValid: showToDashboardIsValid,
          },
        };
      });
      return;
    }

    onSubmit(walletData);
  }

  const formIsInvalid = !inputs.name.isValid || !inputs.type.isValid;
  !inputs.budget.isValid ||
    !inputs.startCutoff.isValid ||
    !inputs.endCutoff.isValid ||
    !inputs.showToDashboard.isValid;

  // Date change handler
  const dateSCChangeHandler = (event, selectedDate) => {
    setSCShowDatePicker(false); // Hide the date picker after selecting a date
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      inputChangedHandler("startCutoff", getFormattedDate(currentDate));
    }
  };

  // Toggle date picker visibility
  const showSCDatepickerHandler = () => {
    setSCShowDatePicker(true); // Show the date picker when the input is pressed
  };

  // Date change handler
  const dateECChangeHandler = (event, selectedDate) => {
    setECShowDatePicker(false); // Hide the date picker after selecting a date
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      inputChangedHandler("endCutoff", getFormattedDate(currentDate));
    }
  };

  // Toggle date picker visibility
  const showECDatepickerHandler = () => {
    setECShowDatePicker(true); // Show the date picker when the input is pressed
  };

  // Show or hide the type selection menu
  const toggleTypeMenu = () => {
    setIsTypeMenuVisible((prev) => !prev);
  };

  // Show or hide the type selection menu
  const toggleSDMenu = () => {
    setIsSDMenuVisible((prev) => !prev);
  };

  // Select a type from the menu
  const selectTypeHandler = (type) => {
    inputChangedHandler("type", type);
    toggleTypeMenu();
  };

  // Select a type from the menu
  const selectSDTypeHandler = (showToDashboard) => {
    inputChangedHandler("showToDashboard", showToDashboard);
    toggleSDMenu();
  };

  return (
    <PaperProvider>
      <View style={styles.form}>
        <Text style={styles.title}>Your Wallet</Text>
        <View style={styles.inputsRow}>
          <Input
            style={styles.rowInput}
            label="Wallet Name"
            invalid={!inputs.name.isValid}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, "name"),
              value: inputs.name.value,
            }}
          />
          <Input
            style={styles.rowInput}
            label="Set Budget"
            invalid={!inputs.budget.isValid}
            textInputConfig={{
              keyboardType: "decimal-pad",
              onChangeText: inputChangedHandler.bind(this, "budget"),
              value: inputs.budget.value,
            }}
          />
        </View>
        <View style={styles.inputsRow}>
          <TouchableWithoutFeedback onPress={toggleTypeMenu}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                label="Wallet Type"
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
          <TouchableWithoutFeedback onPress={showSCDatepickerHandler}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                label="Start Cutoff"
                invalid={!inputs.startCutoff.isValid}
                textInputConfig={{
                  placeholder: "Select Date",
                  maxLength: 10,
                  editable: false, // Make it non-editable
                  value: inputs.startCutoff.value,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          {showSCDatePicker && (
            <DateTimePicker
              testID="startDateTimePicker"
              value={new Date(inputs.startCutoff.value || Date.now())}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={dateSCChangeHandler}
            />
          )}
          <TouchableWithoutFeedback onPress={showECDatepickerHandler}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                style={styles.rowInput}
                label="End Cutoff"
                invalid={!inputs.endCutoff.isValid}
                textInputConfig={{
                  placeholder: "Select Date",
                  maxLength: 10,
                  editable: false, // Make it non-editable
                  value: inputs.endCutoff.value,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          {showECDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(inputs.endCutoff.value || Date.now())}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={dateECChangeHandler}
            />
          )}
        </View>

        <View style={styles.inputsRow}>
          <TouchableWithoutFeedback onPress={toggleSDMenu}>
            <View style={[styles.inputsRow, styles.typeInput]}>
              <Input
                label="Show to dashboard?"
                invalid={!inputs.showToDashboard.isValid}
                textInputConfig={{
                  editable: false, // Make it non-editable to act like a select box
                  value: inputs.showToDashboard.value || "Select Type",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {isSDMenuVisible && (
            <Modal
              transparent={true}
              visible={isSDMenuVisible}
              animationType="fade"
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.typeMenu}>
                  {mainWalletOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => selectSDTypeHandler(item.name)}
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

export default WalletForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rowInput: {
    flex: 1,
  },
  typeInput: {
    flex: 1,
    justifyContent: "center",
  },
  startDateInputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  endDateInputContainer: {
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
    padding: 20,
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

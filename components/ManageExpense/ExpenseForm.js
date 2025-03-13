import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";
import DateTimePicker from "@react-native-community/datetimepicker";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
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
  });

  // Date Picker visibility state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // UseEffect to update inputs when defaultValues change (when editing an existing expense)
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
      });
    }
  }, [defaultValues]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
      type: inputs.type.value,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    const typeIsValid = expenseData.type;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid || !typeIsValid) {
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
          type: { value: curInputs.type.value, isValid: typeIsValid },
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

  const dateChangeHandler = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker after selecting a date
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      inputChangedHandler("date", getFormattedDate(currentDate));
    }
  };

  const showDatepickerHandler = () => {
    setShowDatePicker(true); // Show the date picker when the input is pressed
  };

  return (
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
          {/* TouchableWithoutFeedback to close the keyboard when clicking on date */}
          <TouchableWithoutFeedback onPress={showDatepickerHandler}>
            <View style={styles.dateInputContainer}>
              <Input
                style={styles.rowInput}
                label="Date"
                invalid={!inputs.date.isValid}
                textInputConfig={{
                  placeholder: "YYYY-MM-DD",
                  maxLength: 10,
                  editable: false, // Make it non-editable to prevent manual input
                  value: inputs.date.value,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Show DateTimePicker when the user taps on the Date Input */}
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
        <Input
          style={styles.rowInput}
          label="Type"
          invalid={!inputs.type.isValid}
          textInputConfig={{
            placeholder: "Ex. Food",
            maxLength: 15,
            onChangeText: inputChangedHandler.bind(this, "type"),
            value: inputs.type.value,
          }}
        />
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
  );
}

export default ExpenseForm;

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
});

import axios from "axios";
import { insertExpenses } from "./database";
import { updateExpenseItem } from "./database";
import { fetchListOfExpenses } from "./database";
import { deleteExpenseById } from "./database";
import { getFormattedDate } from "./date";

const BACKEND_URL =
  "https://expense-tracker-2c014-default-rtdb.asia-southeast1.firebasedatabase.app";

export async function storeExpense(expenseData) {
  // const response = await axios.post(
  //   BACKEND_URL + "/expenses.json",
  //   expenseData
  // );

  const response = await insertExpenses(expenseData);

  return response;
  // const id = response.data.name;
  // return id;
}

export async function fetchExpenses() {
  // Get the response from the database (array of expenses)
  const response = await fetchListOfExpenses();

  const expenses = [];

  for (const expense of response) {
    let formattedDate = null;

    // Check if the date exists and is valid
    if (expense.date && expense.date !== "") {
      // If the date is valid, format it
      if (isValidDate(expense.date)) {
        formattedDate = getFormattedDate(expense.date);
      } else {
        // console.warn(
        //   `Invalid date format for expense ID: ${expense.id}. Using fallback.`
        // );
        formattedDate = "Invalid date"; // Or set to '0000-00-00'
      }
    } else {
      // If no date value exists, set the fallback value
      // console.warn(
      //   `Missing date for expense ID: ${expense.id}. Using fallback.`
      // );
      formattedDate = "Invalid date"; // Or set to '0000-00-00'
    }

    // // Create an array in the specific format requested
    // const expenseArray = [
    //   { amount: parseFloat(expense.amount) },
    //   { type: expense.type },
    //   { description: expense.description },
    //   { date: formattedDate },
    //   { id: expense.id },
    // ];

    expenses.push(expense);
  }

  return expenses;
}

// Function to check if a date string is in a valid format 'YYYY-MM-DD'
function isValidDate(dateString) {
  // Regular expression for 'YYYY-MM-DD' format
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (regex.test(dateString)) {
    const date = new Date(dateString);
    // Check if it's a valid date object
    return !isNaN(date.getTime());
  }
  return false;
}

export async function updateExpense(id, expenseData) {
  const response = await updateExpenseItem(id, expenseData);
  return response;
}

export async function deleteExpense(id) {
  return await deleteExpenseById(id);
}

import axios from "axios";
import { insertExpenses } from "./database";
import { insertWallet } from "./database";
import { updateExpenseItem } from "./database";
import { fetchListOfExpenses } from "./database";
import { deleteExpenseById } from "./database";

import { updateWalletItem } from "./database";
import { fetchListOfWallets } from "./database";
import { deleteWalletById } from "./database";

import { WalletContext } from "../store/wallet-context";
import { getFormattedDate } from "./date";

const BACKEND_URL =
  "https://expense-tracker-2c014-default-rtdb.asia-southeast1.firebasedatabase.app";

export async function storeExpense(expenseData, dispatch) {
  try {
    const response = await insertExpenses(expenseData);

    // If you need to use the insertedExpenseId, you can access it like so:
    const insertedExpenseId = response.insertedExpenseId;

    // After the expense is inserted, we need to fetch the updated wallet data
    const updatedWallets = await fetchListOfWallets();

    // Dispatch the updated wallet list to update the WalletContext
    dispatch({ type: "SET", payload: updatedWallets });

    return insertedExpenseId; // You can return the ID or any other relevant data
  } catch (error) {
    console.error("Error storing expense:", error);
  }
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

export async function storeWallet(walletData, dispatch) {
  try {
    const response = await insertWallet(walletData);

    // After the wallet is stored, we need to fetch the updated list of wallets
    const updatedWallets = await fetchListOfWallets();

    // Dispatch the updated wallet list to update the WalletContext
    dispatch({ type: "SET", payload: updatedWallets });

    return response;
  } catch (error) {
    console.error("Error storing wallet:", error);
  }
}

export async function fetchWallet() {
  // Get the response from the database (array of expenses)
  const response = await fetchListOfWallets();

  const wallets = [];

  for (const wallet of response) {
    let formattedDate = null;

    // Check if the date exists and is valid
    if (wallet.date && wallet.date !== "") {
      // If the date is valid, format it
      if (isValidDate(wallet.date)) {
        formattedDate = getFormattedDate(wallet.date);
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

    wallets.push(wallet);
  }

  return wallets;
}

export async function updateWallet(id, expenseData) {
  const response = await updateWalletItem(id, expenseData);
  return response;
}

export async function deleteWallet(id) {
  return await deleteWalletById(id);
}

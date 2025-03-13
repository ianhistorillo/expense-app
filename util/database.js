import * as SQLite from "expo-sqlite";
import { getFormattedDate } from "./date";

export async function init() {
  try {
    // Open the database asynchronously
    const db = await SQLite.openDatabaseAsync("finance-tracker.db");

    // Create the table and insert initial data using execAsync
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY NOT NULL,
        amount TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error("Database error:", error);
  }
}

export async function insertExpenses(expense) {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    const formattedDate = getFormattedDate(expense.date); // Ensure correct date format

    const result = await db.runAsync(
      `INSERT INTO expenses (amount, date, description, type) VALUES (?, ?, ?, ?)`,
      [expense.amount, formattedDate, expense.description, expense.type] // Bind parameters
    );

    return result; // Return the result
  } catch (error) {
    console.error("Error inserting expense:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function fetchListOfExpenses() {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously

    // Fetch all expenses using getAllAsync
    const result = await db.getAllAsync("SELECT * FROM expenses");
    const expensesItem = [];

    // Format the date and handle missing/invalid dates
    for (const exp of result) {
      let formattedDate = null;

      if (exp.date && exp.date.trim() !== "") {
        const parsedDate = new Date(exp.date);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = getFormattedDate(parsedDate); // Format the date if valid
        } else {
          formattedDate = "Invalid date"; // Fallback if the date is invalid
        }
      } else {
        formattedDate = "Invalid date"; // Fallback for missing date
      }

      expensesItem.push({
        amount: exp.amount,
        date: formattedDate,
        description: exp.description,
        type: exp.type,
        id: exp.id,
      });
    }

    return expensesItem; // Return the formatted expenses array
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function updateExpenseItem(expenseId, expense) {
  console.log("Updating: ", expense);
  console.log("UpdatingID: ", expenseId);
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    let formattedDate = "Invalid date"; // Default fallback value
    const expenseItemDate = expense.date;

    // Check if the date exists and is valid
    if (expenseItemDate) {
      const parsedDate = new Date(expenseItemDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = getFormattedDate(parsedDate); // Format if valid
      } else {
        console.warn(
          `Invalid date format for expense ID ${expenseId}: ${expenseItemDate}`
        );
      }
    }

    const result = await db.runAsync(
      `UPDATE expenses SET amount = ?, description = ?, type = ?, date = ? WHERE id = ?`,
      [
        expense.amount,
        expense.description,
        expense.type,
        formattedDate,
        expenseId,
      ] // Bind parameters
    );

    console.log(`Expense with ID ${expenseId} updated successfully.`);
    return result; // Return result after updating
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function deleteExpenseById(expenseId) {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    const result = await db.runAsync(
      "DELETE FROM expenses WHERE id = ?;", // SQL query to delete the record
      [expenseId] // Bind the expenseId to the query
    );

    console.log(`Expense with ID ${expenseId} deleted successfully.`);
    return result; // Return result after deletion
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error; // Handle or rethrow the error
  }
}

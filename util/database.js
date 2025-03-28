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

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS wallet (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        budget INT NOT NULL,
        startCutoff TEXT NOT NULL,
        endCutoff TEXT NOT NULL,
        showToDashboard TEXT NOT NULL
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

    // Extract relevant data from the result
    const insertedExpenseId = result.lastInsertRowId; // ID of the newly inserted expense
    const changes = result.changes; // Number of affected rows (should be 1 for insert)

    // Step 2: Fetch the current wallet data to update its budget
    const walletResult = await db.getFirstAsync(
      `SELECT * FROM wallet WHERE name = ?`,
      [expense.wallet] // Get the wallet that corresponds to the 'wallet' field in the expense
    );

    if (walletResult) {
      // Step 3: Calculate the new wallet budget
      const newBudget = walletResult.budget - expense.amount;

      // Step 4: Update the wallet table with the new budget
      await db.runAsync(
        `UPDATE wallet SET budget = ? WHERE id = ?`,
        [newBudget, walletResult.id] // Update the wallet's budget
      );

      console.log(`Wallet with ID ${walletResult.id} updated successfully.`);
    } else {
      console.log(`Wallet named "${expense.wallet}" not found.`);
    }

    // Return only the relevant data (inserted row ID and changes count)
    return {
      insertedExpenseId, // ID of the newly inserted expense
      changes, // Number of rows affected by the insert operation
    };
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

export async function insertWallet(wallet) {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    const formattedSCDate = getFormattedDate(wallet.startCutoff); // Ensure correct date format
    const formattedECDate = getFormattedDate(wallet.endCutoff); // Ensure correct date format

    const result = await db.runAsync(
      `INSERT INTO wallet (name, type, budget, startCutoff, endCutoff, showToDashboard) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        wallet.name,
        wallet.type,
        wallet.budget,
        formattedSCDate,
        formattedECDate,
        wallet.showToDashboard,
      ] // Bind parameters
    );

    return result; // Return the result
  } catch (error) {
    console.error("Error inserting expense:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function fetchListOfWallets() {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously

    // Fetch all expenses using getAllAsync
    const result = await db.getAllAsync("SELECT * FROM wallet");
    const walletItem = [];

    // Format the date and handle missing/invalid dates
    for (const wallet of result) {
      let formattedSCDate = null;
      let formattedECDate = null;

      if (wallet.startCutoff && wallet.startCutoff.trim() !== "") {
        const parsedSCDate = new Date(wallet.startCutoff);
        if (!isNaN(parsedSCDate.getTime())) {
          formattedSCDate = getFormattedDate(parsedSCDate); // Format the date if valid
        } else {
          formattedSCDate = "Invalid date"; // Fallback if the date is invalid
        }
      } else {
        formattedSCDate = "Invalid date"; // Fallback for missing date
      }

      if (wallet.endCutoff && wallet.endCutoff.trim() !== "") {
        const parsedECDate = new Date(wallet.endCutoff);
        if (!isNaN(parsedECDate.getTime())) {
          formattedECDate = getFormattedDate(parsedECDate); // Format the date if valid
        } else {
          formattedECDate = "Invalid date"; // Fallback if the date is invalid
        }
      } else {
        formattedECDate = "Invalid date"; // Fallback for missing date
      }

      walletItem.push({
        name: wallet.name,
        type: wallet.type,
        budget: wallet.budget,
        startCutoff: formattedSCDate,
        endCutoff: formattedECDate,
        showToDashboard: wallet.showToDashboard,
        id: wallet.id,
      });
    }

    return walletItem; // Return the formatted expenses array
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function updateWalletItem(walletId, wallet) {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    let formattedSCDate = "Invalid date"; // Default fallback value
    const walletItemSCDate = wallet.startCutoff;

    let formattedECDate = "Invalid date"; // Default fallback value
    const walletItemECDate = wallet.endCutoff;

    // Check if the date exists and is valid
    if (walletItemSCDate) {
      const parsedDate = new Date(walletItemSCDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedSCDate = getFormattedDate(parsedDate); // Format if valid
      } else {
        console.warn(
          `Invalid date format for wallet ID ${walletId}: ${walletItemSCDate}`
        );
      }
    }

    // Check if the date exists and is valid
    if (walletItemECDate) {
      const parsedDate = new Date(walletItemECDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedECDate = getFormattedDate(parsedDate); // Format if valid
      } else {
        console.warn(
          `Invalid date format for wallet ID ${walletId}: ${walletItemECDate}`
        );
      }
    }

    const result = await db.runAsync(
      `UPDATE wallet SET name = ?, type = ?, budget = ?, startCutoff = ?, endCutoff = ?, showToDashboard = ? WHERE id = ?`,
      [
        wallet.name,
        wallet.type,
        wallet.budget,
        formattedSCDate,
        formattedECDate,
        wallet.showToDashboard,
        walletId,
      ] // Bind parameters
    );

    console.log(`Wallet with ID ${walletId} updated successfully.`);
    return result; // Return result after updating
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw error; // Handle or rethrow the error
  }
}

export async function deleteWalletById(walletId) {
  try {
    const db = await SQLite.openDatabaseAsync("finance-tracker.db"); // Open database asynchronously
    const result = await db.runAsync(
      "DELETE FROM wallet WHERE id = ?;", // SQL query to delete the record
      [walletId] // Bind the expenseId to the query
    );

    console.log(`Wallet with ID ${walletId} deleted successfully.`);
    return result; // Return result after deletion
  } catch (error) {
    console.error("Error deleting wallet:", error);
    throw error; // Handle or rethrow the error
  }
}

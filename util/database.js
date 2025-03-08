import * as SQLite from "expo-sqlite";
import { getFormattedDate } from "./date";

const database = SQLite.openDatabase("finance-tracker.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY NOT NULL,
            amount TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            type TEXT NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function insertExpenses(expense) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      const formattedDate = getFormattedDate(expense.date); // Ensure correct date format

      tx.executeSql(
        `INSERT INTO expenses (amount, date, description, type) VALUES (?, ?, ?, ?)`,
        [
          expense.amount,
          formattedDate, // Use the formatted date
          expense.description,
          expense.type,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchListOfExpenses() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM expenses", // Query to fetch all expenses
        [],
        (_, result) => {
          const expensesItem = [];

          for (const exp of result.rows._array) {
            let formattedDate = null;

            // Check if the date exists and is not empty
            if (exp.date && exp.date.trim() !== "") {
              // Attempt to parse the date
              const parsedDate = new Date(exp.date);

              // Check if the parsed date is valid
              if (!isNaN(parsedDate.getTime())) {
                // If valid, format the date
                formattedDate = getFormattedDate(parsedDate);
              } else {
                // If the date is invalid, log a warning and use fallback
                // console.warn(
                //   `Invalid date format for expense ID: ${exp.id}. Using fallback.`
                // );
                formattedDate = "Invalid date"; // Or you can use "No date available"
              }
            } else {
              // If the date is missing, use the fallback
              //   console.warn(
              //     `Missing date for expense ID: ${exp.id}. Using fallback.`
              //   );
              formattedDate = "Invalid date"; // Or you can use "No date available"
            }

            // Push the formatted expense into the expenses array
            expensesItem.push({
              amount: exp.amount,
              date: formattedDate, // Use the formatted date or fallback
              description: exp.description,
              type: exp.type,
              id: exp.id,
            });
          }

          // Resolve the promise with the processed expenses array
          resolve(expensesItem);
        },
        (_, error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function updateExpenseItem(expenseId, expense) {
  try {
    // Convert date to proper format if it exists
    let formattedDate = "Invalid date"; // Default fallback value
    const expenseItemDate = expense.date;

    // Check if the date exists and is a valid string
    if (expenseItemDate) {
      const parsedDate = new Date(expenseItemDate);

      // Ensure the date is valid
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = getFormattedDate(parsedDate); // Format the valid date
      } else {
        console.warn(
          `Invalid date format for expense ID ${expenseId}: ${expenseItemDate}`
        );
      }
    }

    const result = await new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `UPDATE expenses SET amount = ?, description = ?, type = ?, date = ? WHERE id = ?`, // Update statement
          [
            expense.amount,
            expense.description,
            expense.type,
            formattedDate,
            expenseId,
          ], // Bind parameters
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });

    console.log(`Expense with ID ${expenseId} updated successfully.`);
    return result; // Return the result of the update (optional)
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error; // Optionally re-throw or handle the error
  }
}

// Function to delete an expense by id
export function deleteExpenseById(expenseId) {
  const promise = new Promise((resolve, reject) => {
    // Begin transaction to delete data
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM expenses WHERE id = ?;", // SQL query to delete the record
        [expenseId], // The expenseId to be passed in the query
        (_, result) => {
          resolve(result); // Resolves if deletion is successful
        },
        (_, error) => {
          reject(error); // Rejects if there's an error
        }
      );
    });
  });

  return promise;
}

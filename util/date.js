export function getFormattedDate(date) {
  // Check if the date is missing or null
  if (!date) {
    // console.warn("Date is null or undefined. Returning fallback value.");
    return "Invalid date"; // Or any fallback you prefer, like "No date available"
  }

  // Check if the date is already a string and matches the 'YYYY-MM-DD' format
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.trim(); // If it's already in the correct format, return as is
  }

  // If date is a Date object, format it to 'YYYY-MM-DD'
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10); // Format Date object to 'YYYY-MM-DD'
  }

  // If date is not valid, return a fallback
  // console.warn("Invalid date format. Returning fallback value.");
  return "Invalid date"; // Or any fallback you prefer
}

export function getDateMinusDays(date, days) {
  const result = new Date(date);
  result.setDate(date.getDate() - days); // Correctly subtract days from the current date
  return result;
}

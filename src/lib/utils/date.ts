/**
 * Format date to readable string
 */
export function formatDate(date: any): string {
  if (!date) return "";
  const jsDate = date.toDate ? date.toDate() : new Date(date);
  return jsDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

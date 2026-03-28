export function convertHistoryToCSV(history) {
  if (!history || history.length === 0) {
    return "";
  }

  const headers = ["time", "height", "velocity", "acceleration", "fuel", "state"];

  const rows = history.map((row) => [
    row.time,
    row.height,
    row.velocity,
    row.acceleration,
    row.fuel,
    row.state || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(","))
  ].join("\n");

  return csvContent;
}

export function downloadCSV(filename, csvContent) {
  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

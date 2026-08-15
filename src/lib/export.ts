export type CsvRow = ReadonlyArray<string | number>;

function escapeCell(cell: string | number): string {
  const value = String(cell);
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function toCsv(rows: readonly CsvRow[]): string {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

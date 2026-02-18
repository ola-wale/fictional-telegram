function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function exportCompanyAsJson(data: { name: string } & Record<string, unknown>) {
  const safeName = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "company";
  const filename = `${safeName}-export.json`;
  downloadJson(data, filename);
}

export function exportAllCompaniesAsJson(companies: unknown[]) {
  downloadJson(companies, "all-companies-export.json");
}

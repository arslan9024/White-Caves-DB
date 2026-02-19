import XLSX from 'xlsx'
export async function findDataFromSheet(ClusterName) {
  const excelSheet = XLSX.readFile(`./data/${ClusterName}.xlsx`).Sheets.Sheet1
  const sheetData = XLSX.utils.sheet_to_json(excelSheet)
  return sheetData
}
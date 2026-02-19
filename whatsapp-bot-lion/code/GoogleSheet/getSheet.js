import { google } from 'googleapis';
import { PowerAgent } from "../GoogleAPI/main.js"

export async function getSheet(Project) {
    // console.log("get Sheet data for", Project)

    let sheetData;
    const gsapi = google.sheets({ version: 'v4', auth: PowerAgent });
    const opt = {
        spreadsheetId: Project.ProjectSheetID,
        range: "Sheet1"
    };
    try {
        sheetData = await gsapi.spreadsheets.values.get(opt);

    } catch (error) {
        console.log(error)
    }
    // console.log("get Sheet data for data",sheetData.data.values )
    return sheetData;
};
import { google } from 'googleapis';
import { PowerAgent } from "../GoogleAPI/main.js"

export async function getOneRowFromSheet(Project, ClusterName, UnitNumber) {
    console.log("get Sheet data for ----------------------", Project.ProjectSheetID);
        console.log("Message Cluster Name and UnitNumber", UnitNumber, ClusterName);


    let sheetData;
      // let result= data.data.values.filter(x=>x.includes(ClusterName));
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
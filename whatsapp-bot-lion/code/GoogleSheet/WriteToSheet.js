import { google } from 'googleapis';
import { PowerAgent } from "../GoogleAPI/main.js";
import { MyProjects } from "../MyProjects/MyProjects.js";


export async function WriteToSheet(msg) {
    // console.log("WriteToSheet", msg)
    console.log("CollectInputForWriteToSheet the function has pid  44")
      let Project = MyProjects.find((x) => x.ProjectID === 44);


    let sheetData;
    const gsapi = google.sheets({ version: 'v4', auth: PowerAgent });
    const opt = {
        spreadsheetId: Project.ProjectSheetID,
        range: "Sheet1!A:C",
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[msg.from, msg.to,msg.body]]
        }
    };

    try {
        console.log("adding data to sheet")

        sheetData = await gsapi.spreadsheets.values.append(opt);

    } catch (error) {
        console.log(error)
    }
    // console.log("get Sheet data for data",sheetData.data.values )
    return sheetData;
};
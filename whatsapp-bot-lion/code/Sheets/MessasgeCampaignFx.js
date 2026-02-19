import { findDataFromSheet } from "./data.js";
import { sleepTime } from "../Time/sleepTime.js";
import { rectifyCorrectNumbers} from './rectifyContactNumbers.js'

export async function startMessageCampaign(msg){
  
    const data = await findDataFromSheet(msg.body);
    sleepTime(2000)
    console.log(data)
     const CleanNumbersResult = [...new Set(rectifyCorrectNumbers(data))]
    const WANumbers=CleanNumbersResult.map(number => `${number}@c.us`)
    console.log("clean number result", WANumbers)

    return WANumbers
}
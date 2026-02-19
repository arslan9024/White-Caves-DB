
import { MyProjects } from "../MyProjects/MyProjects.js";
import { ClientQuestionsArray, ClientAnswersArray } from "../Message/questionsInConverstation.js";
import { getSheet } from '../GoogleSheet/getSheet.js';
import { getNumbersArrayFromRows } from '../GoogleSheet/getNumberFromSheet.js'
import { sendBroadcast } from "./sendBroadCast.js"
export async function MessageAnalyzer(msg) {
    try {
        if ((msg.body == 'Tell me clusters in Damac Hills 2')) {
            let myJSON = JSON.stringify(D2Array)
            msg.reply(myJSON);
        }
        else if ((ClientQuestionsArray.includes(msg.body))) {
            let index = ClientQuestionsArray.findIndex(x => x === msg.body);
            // console.log("message has this in body", index)
            // console.log("message has this in body", msg.body)
            // console.log("the question was for this index has this", ClientQuestionsArray[index])
            // console.log("the answers will be this index has this", ClientAnswersArray[index])
            msg.reply(ClientAnswersArray[index])
        }
        else if (MyProjects.find(x => x.ProjectName === msg.body)) {
            console.log("in campaign of the", msg.body)
            let Project = MyProjects.find(x => x.ProjectName === msg.body);
            const data = await getSheet(Project);
            console.log("still working code Last", data)
            const ArrayNumbers = await getNumbersArrayFromRows(data);
            console.log("still working code CleanNumbersResult", ArrayNumbers)
            const result = await sendBroadcast(ArrayNumbers);
            console.log("we have completed the campaign for Sheet data for index", Project)
            if (result) {
                msg.reply(`It will be my pleasure sending a message to all the owners in ${msg.body} Project, 
            My King! i will message you after i finish all.
            Total Numbers in this project are ${[Project]}`);
            }
        }
    } catch (error) {
        console.log(error)
    }
}

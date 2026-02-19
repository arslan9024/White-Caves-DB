import { Lion0} from "../../index.js";
import { MyProjectsWMN } from "../MyProjects/MyProjectsWMN.js";
import { CorrectifyOneNumer } from "../Contacts/CorrectifyOneNumer.js";
import { getOneRowFromSheet } from "../GoogleSheet/getOneRowFromSheet.js";

export async function ReplyTheContactsFromProject(msg, Time) {
    let SendReport;
  console.log("in campaign of the project", msg.from);
  console.log("in campaign of the project", msg.to);
  console.log("in campaign of the project", msg.body);
  let UnitNumber = await msg.body.replace(/\D/g, '');
try {
let splitted = msg.body.split( '-IN-' );
let ClusterName= splitted[1];
       let Project =  MyProjectsWMN[1];
       const OneRow = await getOneRowFromSheet(Project, ClusterName, UnitNumber);
      console.log("Project sheet has OneRow", OneRow);
      // let result= data.data.values.filter(x=>x.includes(ClusterName));

      // console.log("Project sheet has SendReport", result);

      const ReplyToAgent= result[0];
  console.log("in ReplyToAgent", ReplyToAgent);

      let rr= await CorrectifyOneNumer(ReplyToAgent[7]).toString();

      rr !="" ? 
         SendReport = await Lion0.sendMessage(msg.from, rr) 
         :
         SendReport = await Lion0.sendMessage(msg.from, "There was no Muncipiality Number") ;
      

  // console.log("in campaign of the ReplyTheContactsFromProject SendReport", SendReport);
h
} catch (error) {
    console.log(error)
}
}
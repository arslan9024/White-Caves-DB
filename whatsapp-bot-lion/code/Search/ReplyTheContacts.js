import { Lion0} from "../../index.js";
import { MyProjectsWMN } from "../MyProjects/MyProjectsWMN.js";
import { getSheetWMN } from "../GoogleSheet/getSheetWMN.js";
import { CorrectifyOneNumer } from "../Contacts/CorrectifyOneNumer.js";

export async function ReplyTheContacts(msg, Time) {
    let SendReport;
  // console.log("in campaign of the project", msg.from);
  // console.log("in campaign of the project", msg.to);
  // console.log("in campaign of the project", msg.body);
//   console.log("in campaign of the project", msg.recvFresh);
//   console.log("in campaign of the project", msg.isNewMsg);
//   console.log("in campaign of the project", msg.ack);
  console.log("in msg.id.id", msg.id.id);
  let MunicipalityNumber = await msg.body.replace(/\D/g, '/');
        console.log("Message type is chat includes Municipality", MunicipalityNumber);

try {

       let Project =  MyProjectsWMN[1];
        console.log("Message type is chat includes Municipality", Project);

 const data = await getSheetWMN(Project);


    //   let Project =  msg.body.includes(x.ProjectName);

    //   const data = await getSheetWMN(Project);
      console.log("Project sheet has Length", data.data.values);
      let result= data.data.values.filter(x=>x.includes(MunicipalityNumber));

      console.log("Project sheet has SendReport", result);
      const ReplyToAgent= result[0];
  console.log("in ReplyToAgent", ReplyToAgent);

      let rr= await CorrectifyOneNumer(ReplyToAgent[7]).toString();

      rr !="" ? 
         SendReport = await Lion0.sendMessage(msg.from, rr) 
         :
         SendReport = await Lion0.sendMessage(msg.from, "There was no Muncipiality Number") ;
      

  console.log("in campaign of the project", SendReport);
  
  await Lion0.sendMessage(msg.to, `+${rr}`) 
} catch (error) {
    console.log(error)
}
}
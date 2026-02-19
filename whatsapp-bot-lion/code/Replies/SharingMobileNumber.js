import { getSheetWMN } from "../GoogleSheet/getSheetWMN.js";
import { MyProjectsWMN } from "../MyProjects/MyProjectsWMN.js";
import { Lion0 } from "../../index.js";
import { CorrectifyOneNumer } from "../Contacts/CorrectifyOneNumer.js";

export async function SharingMobileNumber(msg) {
    let SendReport;

  console.log("in msg.id.id", msg.id.id);
  let MunicipalityNumber = await (msg.body.split("/",3))[2];
  let HouseNumber = await (msg.body.split("/",3))[1].split("=")[1];

        console.log("House Number is", HouseNumber);
    try {
    console.log("Message type was chat so we are in new function", MunicipalityNumber);
    let Project =  MyProjectsWMN[1];
            console.log("Message type is chat includes Municipality", Project);
             const data = await getSheetWMN(Project);
               console.log("Project sheet has Length", data.data.values);
      let result= data.data.values.filter(x=>x.includes(MunicipalityNumber));

      console.log("Project sheet has SendReport", result);
      const ReplyToAgent= result[0];
//   console.log("in ReplyToAgent", ReplyToAgent);
    //    let rr= await CorrectifyOneNumer(ReplyToAgent[7]).toString();

         let rr= await CorrectifyOneNumer(ReplyToAgent[7]).toString();
  
        rr !="" ? SendReport = await Lion0.sendMessage(msg.from, rr) 
           :SendReport = await Lion0.sendMessage(msg.from, "There was no Muncipiality Number") ;
        
  
    // console.log("in campaign of the project", SendReport);
    
    await Lion0.sendMessage("120363408658209875@g.us", `Cluster=${ReplyToAgent[2]} with ${msg.body}   +${rr}`) 
       return true 
    } catch (error) {
        console.log(error)
    }
}

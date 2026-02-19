import { Lion0 } from "../../index.js";


export async function FindAndShareOwnerNumberOnAgentRequestFromProject(msg, Time) {
  console.log("in campaign of the project", msg.from);
  console.log("in campaign of the project", msg.to);
  console.log("in campaign of the project", msg.body);
  console.log("in campaign of the project", msg.recvFresh);
  console.log("in campaign of the project", msg.isNewMsg);
  console.log("in campaign of the project", msg.ack);
  console.log("in msg.id.id", msg.id.id);



const SendReport = await Lion0.sendMessage(msg.from, "Reply this message with the Cluster Name and Unit Number of the house")



    //   let Project =  msg.body.includes(x.ProjectName);

    //   const data = await getSheetWMN(Project);
    //   console.log("Project sheet has Length", data.data.values.length);
      console.log("Project sheet has SendReport",SendReport);





try {

    
} catch (error) {
    console.log(error)
}
}
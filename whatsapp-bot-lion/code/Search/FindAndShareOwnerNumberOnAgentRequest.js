import { Lion0 } from "../../index.js";
import { HuntingReply1 } from "./HuntingReply1.js";

export async function FindAndShareOwnerNumberOnAgentRequest(msg, Time) {
  console.log("in campaign of the project", msg.from);
  console.log("in campaign of the project", msg.to);
  console.log("in campaign of the project", msg.body);
  console.log("in campaign of the project", msg.recvFresh);
  console.log("in campaign of the project", msg.isNewMsg);
  console.log("in campaign of the project", msg.ack);
  // console.log("in msg.id.id", msg.id.id);
  //   let Project =  msg.body.includes(x.ProjectName);
  //   const data = await getSheetWMN(Project);
  //   console.log("Project sheet has Length", data.data.values.length);
  // console.log("Project sheet has SendReport", SendReport);
  try {
  const SendReport = await Lion0.sendMessage(msg.from, HuntingReply1)
  } catch (error) {
    console.log(error)
  }
}
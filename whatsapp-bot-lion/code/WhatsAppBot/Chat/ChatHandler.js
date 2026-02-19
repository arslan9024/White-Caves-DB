
export async function ChatHandler(msg) {

    console.log("message has this in msg.hasQuotedMsg", msg.hasQuotedMsg);
    try {
            
            if (msg.body === "Kindly share the mobile number of the owner") {
              console.log("The agent has requested the number of one owner");
            }
    } catch (error) {
        console.log(error);
    }
}
// import { ProjectCampaign } from "../../MyProjects/ProjectCampaign.js";
// import { findWord } from "../../Search/findWord.js";
// import { MyProjects } from "../../MyProjects/MyProjects.js";
// import { FindAndShareOwnerNumberOnAgentRequest } from "../../Search/FindAndShareOwnerNumberOnAgentRequest.js";
// import { ReplyTheContacts } from "../../Search/ReplyTheContacts.js";
// import {
//   ClientQuestionsArray,
//   ClientAnswersArray
// } from "../../Message/questionsInConversation.js";
// import { CreatingNewWhatsAppClientLucy } from "../CreatingNewWhatsAppClientLucy.js";
// import { WhatsAppClientFunctions } from "../WhatsAppClientFunctions.js";
// import { RegisterAgentsInSystem } from "../../My Agents/RegisterAgentsInSystem.js";
// import { FindAgentsInSystem } from "../../My Agents/FindAgentsInSystem.js";
// import { SendMessagesForMe } from "../../Message/SendMessagesForMe.js";
// import { Lion0 } from "../../../index.js";

// export async function ChatHandler(msg) {

//   console.log("Message type is chat");
//   console.log("message msg.from", msg.from);
//   console.log("message msg.type", msg.type);
//   console.log("message has this in msg.hasQuotedMsg", msg.hasQuotedMsg);

//   try {

//     if (msg.body === "Kindly share the mobile number of the owner") {
//       console.log("The agent has requested the number of one owner");
//       await FindAndShareOwnerNumberOnAgentRequest(msg);
//     }
//     else if (msg.body === "I want to register as an agent") {
//      await RegisterAgentsInSystem(msg);
//      msg.reply("You are registered!")
//     }
//       else if (msg.body === "Tell me all registered agents") {
//       FindAgentsInSystem(msg);
//     }
//           else if (msg.body === "Send Messages for me to Zinnia Cluster") {
//       SendMessagesForMe(msg);
//     }
//     else if (msg.body.includes("Municipality Number=") && msg.hasQuotedMsg) {
//       console.log("Message type is chat includes Municipality");
//       await ReplyTheContacts(msg);
//     }
//     else if (ClientQuestionsArray.includes(msg.body)) {
//       let index = ClientQuestionsArray.findIndex((x) => x === msg.body);
//       // console.log("message has this in body", msg.body)
//       // console.log("the question was for this index has this", ClientQuestionsArray[index])
//       // console.log("the answers will be this index has this", ClientAnswersArray[index])
//       msg.reply(ClientAnswersArray[index]);
//     }
//     else if (msg.body === "Kindly share the secondary mobile number of the owner") {
//       console.log("The agent has requested the number of one owner");

//     }
//     else if (MyProjects.find((x) => x.ProjectName === msg.body)) {
//       let Project = MyProjects.find((x) => x.ProjectName === msg.body);
//       const sentence = "How much wood could a wood chip chop";
//       const wordToFind = "woo";
//       const result1 = findWord(wordToFind, sentence);
//       console.log(result1);
//       const result = await ProjectCampaign(Project);
//       result
//         ? console.log(`Project has result this
//          successfully contacted is ${result},`)
//         : console.log(`Project ${msg.body} has no result from campaign!`);
//     }

//     else if (MyProjects.find((x) => x.ProjectName === msg.body) && msg.body.includes("Mission Speed")) {
//       // Time.Speed = findSpeedForMission(msg.body);

//     }

//     else if (msg.body === "I want to signup as lucy") {
//       console.log("The new object creation.......");
//       Lucy = await CreatingNewWhatsAppClientLucy("Lucy");
//       WhatsAppClientFunctions(Lucy);
//       console.log("the result from new agent", Lucy.info);
//     }
//     else {
//       //  SendSecretMessage(msg);
//     }

//   } catch (error) {

//   }
// }
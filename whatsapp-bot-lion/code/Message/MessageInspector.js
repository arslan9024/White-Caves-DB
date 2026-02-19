// import { MyProjects } from "..//../MyProjects/MyProjects.js";
// import { FindAndShareOwnerNumberOnAgentRequest } from "../Search/FindAndShareOwnerNumberOnAgentRequest.js";
// import { ReplyTheContacts } from "../Search/ReplyTheContacts.js";
// import singularWhatsappSessionManager from "./SessionManager/WhatsappSessionManager.js";
// import { WhatsAppClientFunctions } from "..//..//code/WhatsAppBot/WhatsAppClientFunctions.js";

// import {
//   ClientQuestionsArray,
//   ClientAnswersArray,
// } from "../../code/Message/questionsInConversation.js";
// import { ProjectCampaign } from "..//MyProjects/ProjectCampaign.js";
// import { Time } from "..//Inputs/InputOne.js";

// import { findWord } from "../Search/findWord.js";

// import { WriteToSheet } from "../GoogleSheet/WriteToSheet.js";
// import { CreatingNewWhatsAppClientWithSession } from "../WhatsAppBot/SessionManager/CreatingNewWhatsAppClientWithSession.js";
// export async function MessageInspector(msg) {

//   try {
//     // console.log("message has received", msg);
//     if (msg.from != "status@broadcast" || msg.from.length < 17 || msg.type === "image") {
//       // const messageEntryResult = await WriteToSheet(msg);
//     }
//     if (msg.type === 'chat') {
//       // console.log("message has this in body", msg);
//       console.log("Message type is chat");
//       // console.log("message has this in body", msg.body);
//       // console.log("message msg.to", msg.to);
//       console.log("message msg.from", msg.from);
//       console.log("message msg.type", msg.type);
//       console.log("message has this in msg.hasQuotedMsg", msg.hasQuotedMsg);
//       // console.log("message has this in body", msg);
//       // console.log("message has this in body", msg.id);
//       if (msg.body === "Kindly share the mobile number of the owner") {
//         console.log("The agent has requested the number of one owner");
//         await FindAndShareOwnerNumberOnAgentRequest(msg);
//       }
//       if (msg.body.includes("Municipality Number=") && msg.hasQuotedMsg) {
//         console.log("Message type is chat includes Municipality");
//         await ReplyTheContacts(msg);
//       }
//       if (ClientQuestionsArray.includes(msg.body)) {
//         let index = ClientQuestionsArray.findIndex((x) => x === msg.body);
//         // console.log("message has this in body", msg.body)
//         // console.log("the question was for this index has this", ClientQuestionsArray[index])
//         // console.log("the answers will be this index has this", ClientAnswersArray[index])
//         msg.reply(ClientAnswersArray[index]);
//       }
//       // else if (msg.body === "I want to signup as mary") {
//       //   // AskTheUserParams(msg);
//       //   // WhatsAppBotClient= CreatingWhatsAppClient(msg.from);
//       //   console.log("The new object creation......");
//       //   console.log("the Id of bot ", WhatsAppBotClient.authStrategy.clientId);
//       //    Mary = await CreatingNewWhatsAppClientMary("Mary");
//       //   WhatsAppClientFunctions(Mary);

//       //   WhatsAppBotClient = await CreatingNewWhatsAppClientWithSession(msg.from);

//       //   const result =
//       //     await singularWhatsappSessionManager.getClientFromSessionId(
//       //       msg.from.slice(0, msg.from.length - 5)
//       //     );
//       //   console.log("the result from new agent", Mary.info);
//       // }
//       else if (msg.body === "I want to register as agent") {
//         console.log("The new object creation.......");
//             const agentR =await CreatingNewWhatsAppClientWithSession(msg.from);
    
//         // console.log("the result from new agent regostration", agentR);

//        WhatsAppClientFunctions(agentR, msg.from, true);

//       }
//       else if (msg.body === "Kindly share the secondary mobile number of the owner") {
//         console.log("The agent has requested the number of one owner");

//       }
//       else if (MyProjects.find((x) => x.ProjectName === msg.body) && msg.body.includes("Mission Speed")) {
//         Time.Speed = findSpeedForMission(msg.body);

//       }
//       else if (MyProjects.find((x) => x.ProjectName === msg.body)) {
//         let Project = MyProjects.find((x) => x.ProjectName === msg.body);
//         const sentence = "How much wood could a wood chip chop";
//         const wordToFind = "woo";
//         const result1 = findWord(wordToFind, sentence);
//         console.log(result1);
//         const result = await ProjectCampaign(Project);
//         result
//           ? console.log(`Project has result this
//          successfully contacted is ${result},`)
//           : console.log(`Project ${msg.body} has no result from campaign!`);
//       }
//     }
//     else {
//       console.log(`Message has no campaign....${msg.type}`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
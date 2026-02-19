import { MyProjects } from "../MyProjects/MyProjects.js";
import { FindAndShareOwnerNumberOnAgentRequest } from "../Search/FindAndShareOwnerNumberOnAgentRequest.js";
import { ReplyTheContacts } from "../Search/ReplyTheContacts.js";
import { changeNormalNumberWithWhatsAppNumber } from "../Contacts/changeWhatsAppNumberWithNormalNumber.js"
import {
  ClientQuestionsArray,
  ClientAnswersArray,
} from "../Message/questionsInConversation.js";
import { ProjectCampaign } from "../MyProjects/ProjectCampaign.js";
import { findWord } from "../Search/findWord.js";
// import { SendSecretMessage } from "../Message/SendSecretMessage.js";


import { WriteToSheet } from "../GoogleSheet/WriteToSheet.js";
import { CreatingNewWhatsAppClientLucy } from "./CreatingNewWhatsAppClientLucy.js";
import { SharingMobileNumber } from "../Replies/SharingMobileNumber.js";
// import { ChatAnalyzer } from "./Chat/ChatAnalyzer.js";
// import { CreatingNewWhatsAppClientForAgent } from "./SessionManager/CreatingNewWhatsAppClientForAgent.js";
// import { NewWhatsAppClientFunctions } from "./SessionManager/NewWhatsAppClientFunctions.js";

export async function MessageAnalyzer(msg) {
  let Lucy;
  try {

    if (msg.type === 'chat') {
      // ChatAnalyzer(msg);
      console.log("message msg.from", msg.from);
      // console.log("message msg.type", msg.type);
      if (msg.body === "Kindly share the mobile number of the owner") {
        console.log("The agent has requested the number of one owner");
        await FindAndShareOwnerNumberOnAgentRequest(msg);
      }
      else if (msg.body.includes("House Number/Municipality Number=") && msg.hasQuotedMsg) {
        console.log("Message type is chat includes Municipality");
        await SharingMobileNumber(msg);
      }
      // else if (msg.body.includes("Municipality Number=") && msg.hasQuotedMsg) {
      //   console.log("Message type is chat includes Municipality");
      //   await ReplyTheContacts(msg);
      // }
      else if (ClientQuestionsArray.includes(msg.body)) {
        let index = ClientQuestionsArray.findIndex((x) => x === msg.body);
        // console.log("message has this in body", msg.body)
        // console.log("the question was for this index has this", ClientQuestionsArray[index])
        // console.log("the answers will be this index has this", ClientAnswersArray[index])
        msg.reply(ClientAnswersArray[index]);
      }
      else if (msg.body === "I want to signup as lucy") {
        console.log("The new object creation.......");
        Lucy = await CreatingNewWhatsAppClientLucy("Lucy");
        WhatsAppClientFunctions(Lucy);
        console.log("the result from new agent", Lucy.info);
      }
      else if (msg.body === "I want to register as agent") {
        console.log("The new object creation.......");
        // const leila = await CreatingNewWhatsAppClientForAgent(msg.from);
        // await NewWhatsAppClientFunctions(leila);
        // console.log("the result from new agent", leila);
      }
      else if (msg.body === "Kindly share the secondary mobile number of the owner") {
        console.log("The agent has requested the number of one owner");

      }
      else if (MyProjects.find((x) => x.ProjectName === msg.body) && msg.body.includes("Mission Speed")) {
        // Time.Speed = findSpeedForMission(msg.body);

      }
      else if (MyProjects.find((x) => x.ProjectName === msg.body)) {
        let Project = MyProjects.find((x) => x.ProjectName === msg.body);
        const sentence = "How much wood could a wood chip chop";
        const wordToFind = "woo";
        const result1 = findWord(wordToFind, sentence);
        console.log(result1);
        const result = await ProjectCampaign(Project);
        result
          ? console.log(`Project has result this
          successfully contacted is ${result},`)
          : console.log(`Project ${msg.body} has no result from campaign!`);
      }
      else {
        console.log("The message has requested the number of one owner");

        //  SendSecretMessage(msg);
      }
    }
    else if (msg.type === 'video'){
      console.log("chat has video")

    }
    else {
      console.log(`Message has other type of --${msg.type}`);
    }
  } catch (error) {
    console.log(error);
  }
}

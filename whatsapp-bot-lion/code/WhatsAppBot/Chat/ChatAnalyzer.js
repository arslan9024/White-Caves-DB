import { SharingMobileNumber } from "..//..//Replies/SharingMobileNumber.js";

export async function ChatAnalyzer(txt) {
    let res;
    console.log("Message type was chat so we are in new function");
    console.log("message txt.from", txt.from);
    console.log("message txt.type", txt.type);
    console.log("message has this in txt.hasQuotedMsg", txt.hasQuotedMsg);
    // console.log("message has received", msg);
    if (txt.from != "status@broadcast" || txt.from.length < 17 || txt.type === "image") {
      // const messageEntryResult = await WriteToSheet(msg);
      // console.log("message msg.from", msg.from);
      // console.log("message msg.type", msg.type);
    }
    try {
        if (txt.body.includes("House Number/Municipality Number=") && txt.hasQuotedMsg) {
            // await ReplyTheContacts(msg);
            //  ReplyTheOwnerMobile(msg);

        }
        else if (txt.body === "Kindly share the mobile number of the owner") {
            console.log("The agent has requested the number of one owner");
      //   await FindAndShareOwnerNumberOnAgentRequest(msg);
            res = SharingMobileNumber();

        }
        else console.log("Kindly write correct House number and Municipality Number");

    } catch (error) {
        console.log(error)
    }
}
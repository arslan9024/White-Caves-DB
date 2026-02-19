import { Eve as WhatsAppBotClient } from "../../index.js"

export async function SendMessageToOneNumber(Number) {
    let result;
    let report;
    let validatedContact;
    let message="Good Morning";
    console.log(Number)

try {
    validatedContact=Number;
    const found = await WhatsAppBotClient.getChatById(validatedContact)
    result= await WhatsAppBotClient.sendMessage(validatedContact, message);
    console.log(result)

} catch (error) {
    console.log(error);
}
return {
    result,
    report
}
}
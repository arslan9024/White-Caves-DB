import WASessionManager from "../WhatsAppBot/SessionManager/CreateOrGetClient.js"
export async function SendMessagesForMe(msg) {
    let result = undefined;
    try {

        console.log("The person who asked total agents registered.......", msg.from);
        // result = await WASessionManager.restorePreviousSessions() 
            

        // return RegisteredAgentWAClient
        console.log(result)
    } catch (error) {
        console.log(error);
    }
}
import WASessionManager from "../WhatsAppBot/SessionManager/CreateOrGetClient.js"
export async function RegisterAgentsInSystem(msg) {
    let RegisteredAgentWAClient = undefined;
    try {

        console.log("The new agent registration.......", msg.from);
        RegisteredAgentWAClient != undefined ?
            //    console.log("returning old session for the client ", RegisteredAgentWAClient) :
            RegisteredAgentWAClient = await WASessionManager.restorePreviousSessions(msg.from) :
            // console.log("creating client for new agent registered", RegisteredAgentWAClient);
            RegisteredAgentWAClient =  WASessionManager.createWAClient(msg.from);

        // return RegisteredAgentWAClient
        console.log(RegisteredAgentWAClient)
    } catch (error) {
        console.log(error);
        console.log("here is the stack ", error.stack);
    }
}
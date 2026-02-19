
import singularWhatsappSessionManager from "../WhatsappSessionManager.js";
export async function CreatingNewWhatsAppClientForAgent(ClientID) {
    let RegisteredAgentWAClient;
    console.log("tHIS PERSON WANTS TO REGISTER", ClientID);
    try {
        RegisteredAgentWAClient = await singularWhatsappSessionManager.getClientFromSessionId(ClientID.slice(0, ClientID.length - 5));
        RegisteredAgentWAClient === undefined ?
            RegisteredAgentWAClient = singularWhatsappSessionManager.createWAClient(ClientID) :
            console.log(" already has this agent registered", RegisteredAgentWAClient);
        // console.log(" the agent registration then result", RegisteredAgentWAClient)
        return RegisteredAgentWAClient;
    } catch (error) {
        console.log(error)
    }




}
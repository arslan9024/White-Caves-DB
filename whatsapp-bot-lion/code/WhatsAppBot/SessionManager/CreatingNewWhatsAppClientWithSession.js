import pkg from "whatsapp-web.js";
const { LocalAuth, Client } = pkg;
import singularWhatsappSessionManager from "../../../code/WhatsAppBot/SessionManager/WhatsappSessionManager.js";
export async function CreatingNewWhatsAppClientWithSession(ClientID) {
    let RegisteredAgentWAClient;
    console.log("tHIS PERSON WANTS TO REGISTER.....", ClientID);
    try {
        RegisteredAgentWAClient = await singularWhatsappSessionManager.getClientFromSessionId(ClientID.slice(0, ClientID.length - 5));
        RegisteredAgentWAClient === undefined ?
            RegisteredAgentWAClient = await singularWhatsappSessionManager.createWAClient(ClientID) :
            console.log("already has this agent registered", RegisteredAgentWAClient);
        console.log("singularWhatsappSessionManager the class then result", RegisteredAgentWAClient)
        return RegisteredAgentWAClient;
    } catch (error) {
        console.log(error)
    }
}
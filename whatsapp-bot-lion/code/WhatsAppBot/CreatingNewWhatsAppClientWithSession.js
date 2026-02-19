import pkg from "whatsapp-web.js";
const { LocalAuth, Client } = pkg;
import { WhatsAppClientFunctions } from "../WhatsAppBot/WhatsAppClientFunctions.js";


import singularWhatsappSessionManager from "./WhatsappSessionManager.js";
// const  = pack;
export async function CreatingNewWhatsAppClientWithSession(ClientID) {
    let RegisteredAgentWAClient;

    console.log("tHIS PERSON WANTS TO REGISTER", ClientID);
    try {
        RegisteredAgentWAClient = await singularWhatsappSessionManager.getClientFromSessionId(ClientID.slice(0, ClientID.length - 5));

        //    const result =singularWhatsappSessionManager.createWAClient(ClientID)

        RegisteredAgentWAClient === undefined ?
            RegisteredAgentWAClient = await singularWhatsappSessionManager.createWAClient(ClientID) :
            console.log("singularWhatsappSessionManager already has this agent registered", RegisteredAgentWAClient);
        console.log("singularWhatsappSessionManager the class then result", RegisteredAgentWAClient)
        //    WhatsAppClientFunctions(RegisteredAgentWAClient);
        return RegisteredAgentWAClient;

        
    } catch (error) {
        console.log(error)
    }




}
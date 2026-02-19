
// import singularWhatsappSessionManager from "./WhatsappSessionManager.js";
// export async function CreatingNewWhatsAppClientForAgent(ClientID) {
//     let RegisteredAgentWAClient;
//     console.log("tHIS PERSON WANTS TO REGISTER", ClientID);
//     try {
//         RegisteredAgentWAClient != undefined ?
//             RegisteredAgentWAClient = await singularWhatsappSessionManager.getClientFromSessionId(ClientID.slice(0, ClientID.length - 5)):
//             RegisteredAgentWAClient = singularWhatsappSessionManager.createWAClient(ClientID);
//         return RegisteredAgentWAClient;
//     } catch (error) {
//         console.log(error)
//     }
// }
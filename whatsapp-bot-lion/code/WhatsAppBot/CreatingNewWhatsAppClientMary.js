import pkg from "whatsapp-web.js";
const { LocalAuth, Client } = pkg;


// const  = pack;
export async function CreatingNewWhatsAppClientMary(ClientID) {
    let RegisteredAgentWAClient;

    console.log("This is the id who needs registration", ClientID);
    try {

        //    const result =singularWhatsappSessionManager.createWAClient(ClientID)

        ClientID != undefined ?
            RegisteredAgentWAClient = new Client({
                authStrategy: new LocalAuth({
                    clientId: `${ClientID}`,
                    dataPath: "sessions",
                }),
                webVersionCache: {
                    type: "remote",
                    remotePath:
                        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
                },
            })
            :
            console.log("Client id is not defined as this agent can not be registered");
        //    WhatsAppClientFunctions(result);
        return RegisteredAgentWAClient;


    } catch (error) {
        console.log(error)
    }




}
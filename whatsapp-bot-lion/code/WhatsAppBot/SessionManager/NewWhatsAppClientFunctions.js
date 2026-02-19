import qrcode from "qrcode-terminal";
import { Lion
} from "../../index.js";

// import { MessageInspector} from "../../../code/Message/MessageInspector.js";

export const NewWhatsAppClientFunctions = (client, number, PCE) => {
  // client initialize does not finish at ready now.
  client.initialize();

  client.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message);
  });

  // Pairing code only needs to be requested once
let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
    console.log('QR RECEIVED', number);

    // pairing code example
    const pairingCodeEnabled = PCE;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode(number); // enter the target phone number
        console.log(`Pairing code enabled for ${number}, code: `+ pairingCode);
        const SendReport = await Lion.sendMessage(number, pairingCode)


        pairingCodeRequested = true;
    }
});

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", msg => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
  });

  // When the client is ready, run this code (only once)
  client.once("ready", () => {
    console.log("Client is ready for service, My King!!!", number);
  });

  client.on("ready", async () => {
    console.log("READY");
    const debugWWebVersion = await client.getWWebVersion();
    console.log(`WWebVersion = ${debugWWebVersion}`);

    client.pupPage.on("pageerror", function(err) {
      console.log("Page error: " + err.toString());
    });
    client.pupPage.on("error", function(err) {
      console.log("Page error: " + err.toString());
    });
  });
  // // When the client received QR-Code
  // client.on("qr", (qr) => {
  //   // console.log('QR RECEIVED', qr);
  //   // QRCodeScanner(qr);
  //   qrcode.generate(qr, { small: true });

  // });

  // client.on("ready", () => {
  //   console.log("CLient is ready again for service, My King!", WhatsAppBotClient.info);
  // });
  // client.initialize();

  client.on("message", msg => {
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
    // MessageInspector(msg);
    // console.log(msg)
  });
};
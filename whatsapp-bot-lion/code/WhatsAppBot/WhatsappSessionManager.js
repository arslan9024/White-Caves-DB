import pkg from "whatsapp-web.js";
const { LocalAuth, Client } = pkg;
// const QRCode = require("qrcode");
import QRCode from "qrcode-terminal";

// const { readdir } = require("fs/promises");
import { readdir } from "fs";
// const { WhatsappWebSession } = require('./WhatsappWebSession');
import WhatsappWebSession from "./whatsappWebSession.js"

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

class WhatsappSessionManager {
  sessionIdVsClientInstance = {};

  constructor() {
   console.log("constructor of the WhatsappSessionManager class ");

    this.sessionIdVsClientInstance = {};
    return this;
  }

  createWAClient = (sessionId, qrGenerationCallback, readyInstanceCallback) => {
   console.log("createWAClient funtion /////////////////////////is having session id", sessionId);

    return new WhatsappWebSession(sessionId, qrGenerationCallback, readyInstanceCallback);
  };

  async restorePreviousSessions(sessionId) {
   console.log("restorePreviousSessions funtion /////////////////////////is having session id", sessionId);

    const directoryNames = await getDirectories(
      "../.wwebjs_auth"
    );
    const sessionIds = directoryNames.map(name => name.split("-")[1]);

    sessionIds.forEach(sessionId => {
   console.log("forEach funtion /////////////////////////is having session id", sessionId);

      this.createWAClient(sessionId);
    });
  }

  getClientFromSessionId = sessionId => {
   console.log("getClientFromSessionId funtion is having session id", sessionId);

    return this.sessionIdVsClientInstance[sessionId];
  };
}

const singularWhatsappSessionManager = new WhatsappSessionManager();
export default singularWhatsappSessionManager;

import pkg from "whatsapp-web.js";
const { LocalAuth, Client } = pkg;
class WhatsappWebSession {
  constructor(ClientID, callback, readyCallback) {
    this.client = new Client({
      puppeteer: {
        headless: true,
        args: '--no-sandbox',
      },
      authStrategy: new LocalAuth({
        clientId: `${ClientID.slice(0,ClientID.length-5)}`,
        dataPath: './agents/session.json',
      }),
      webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  }
    });
    this.client.on('qr', (qr) => {
      this.qr = qr;
      callback(qr);
    });
    this.client.on('ready', () => {
      console.log('Client is ready!');
      readyCallback();
    });

    this.client.initialize();
  }

  getQr() {
    return this.qr;
  }

  getClient() {
    return this.client;
  }

  async destroy() {
    await this.client.destroy();
  }

  async restart() {
    await this.destroy();
    this.client = new Client();
    this.client.on('qr', (qr) => {
      this.qr = qr;
    });
    this.client.initialize();
  }
}

export default WhatsappWebSession;
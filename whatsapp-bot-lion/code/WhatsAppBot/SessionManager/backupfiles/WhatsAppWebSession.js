// import { Client, LocalAuth } from "whatsapp-web.js";

// class WhatsappWebSession {
//   constructor(callback, readyCallback) {
//     this.client = new Client({
//       puppeteer: {
//         headless: true,
//         args: \[
//           '--no-sandbox',
//         \]
//       },
//       authStrategy: new LocalAuth({
//         clientId: 'client-id',
//         dataPath: './session.json',
//       })
//     });
//     this.client.on('qr', (qr) =\> {
//       this.qr = qr;
//       callback(qr);
//     });
//     this.client.on('ready', () =\> {
//       console.log('Client is ready!');
//       readyCallback();
//     });

//     this.client.initialize();
//   }

//   getQr() {
//     return this.qr;
//   }

//   getClient() {
//     return this.client;
//   }

//   async destroy() {
//     await this.client.destroy();
//   }

//   async restart() {
//     await this.destroy();
//     this.client = new Client();
//     this.client.on('qr', (qr) => {
//       this.qr = qr;
//     });
//     this.client.initialize();
//   }
// }

// export default WhatsappWebSession;
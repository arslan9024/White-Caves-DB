// import bot, { Client } from 'whatsapp-web.js';
// import qrcode from 'qrcode-terminal'
// import { MessageAnalyzer } from '../WhatsAppBot/MessageAnalyzer.js';


// export const WhatsAppBotClient = new Client({
//     authStrategy: new bot.LocalAuth(),
//     puppeteer: {
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     }
// })
// WhatsAppBotClient.on('qr', (qr) => {
//     // Generate and scan this code with your phone again now
//     qrcode.generate(qr, {small: true})
//     // console.log('QR RECEIVED', qr);
// });
// WhatsAppBotClient.on('ready', () => {
// console.log('Alina Bot is getting ready!', WhatsAppBotClient.info)
// });
// WhatsAppBotClient.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
//     MessageAnalyzer(msg);
// });
// await WhatsAppBotClient.initialize();
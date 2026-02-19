import bot, { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal'
import { WakingUpDisDisBot } from '../wakingBot.js';

export const NawalBot = new Client({
    authStrategy: new bot.LocalAuth(),
    puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
})
NawalBot.on('qr', (qr) => {
    // Generate and scan this code with your phone again

    qrcode.generate(qr, {small: true})
    // console.log('QR RECEIVED', qr);
});
NawalBot.on('ready', () => {
    console.log('Nawal Bot is getting ready!', NawalBot.info)
    });
    
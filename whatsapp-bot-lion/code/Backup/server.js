import bot, { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal'
import { WakingUpDisDisBot } from './wakingBot.js';

export const Anam = new Client({
    authStrategy: new bot.LocalAuth(),
    puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
})
Anam.on('qr', (qr) => {
    // Generate and scan this code with your phone again now
    qrcode.generate(qr, {small: true})
    // console.log('QR RECEIVED', qr);
});
Anam.on('ready', () => {
console.log('AlinaBot is getting ready!', Anam.info)
});
Anam.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    WakingUpDisDisBot(msg);
});
await Anam.initialize();
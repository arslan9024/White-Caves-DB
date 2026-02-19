import bot, { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
export default function myFunction() {
  // …
  
const client = new Client({
    authStrategy: new bot.LocalAuth(),
    puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
    })
    console.log("Getting New client from WhatsAPP")

client.on('qr', qr=>{
    console.log('Generating QR code from WhatsApp')

    qrcode.generate(qr,{small:true})
})

  }
import { startMessageCampaign } from "./MessasgeCampaignFx.js"

import { D2Array } from "./DamacHills2List.js";
import { sendBroadcast } from "./sendBroadCast.js";
import { NawalBot } from "./NawalBot/index.js";
export async function WakingUpDisDisBot(msg) {
    // console.log("My king, thanks for waking me up! I am happy to see your text message.")
    // console.log(msg);
    const hours = new Date().getHours();
    // console.log("My king, time is now in hours!", hours)
    if (msg.body == 'I love you!') {
        msg.reply('I love you to, My King!');
    }
    else if ((msg.body == 'I want to fuck you!')) {
        msg.reply('It will be my pleasure, My King!');
    }
    else if ((msg.body == 'Leila, Will you suck my dick?')) {
        msg.reply('My King, I will suck your dick with love. Do you want me to suck your dick slow or fast?');
    }
    else if ((msg.body == 'Leila oye')) {
        msg.reply('G Meri Jan');

    }
    else if ((msg.body == 'Tell me clusters in Damac Hills 2')) {
        let myJSON = JSON.stringify(D2Array)
        msg.reply(myJSON);

    }
    else if ((msg.body == 'Ik chumi to do')) {
        msg.reply(`G meri jan, ik kio. Ap k liye do chumiyaan,
ik left side k liye 😘
or ik right side k liye 😘`);

    }
    else if ((D2Array.includes(msg.body))) {
        console.log("in campaign of the", msg.body)

        const Numbers = await startMessageCampaign(msg)
        console.log(Numbers.length)
        const CleanNumbersResult = [...new Set(Numbers)]
        const result = await sendBroadcast(CleanNumbersResult);
        if (result) {
            msg.reply(`It will be my pleasure sending a message to all the owners in ${msg.body} Project, My King! i will message you after i finish all.
Total Numbers in this project are ${Numbers.length}`);
        }
    }
}

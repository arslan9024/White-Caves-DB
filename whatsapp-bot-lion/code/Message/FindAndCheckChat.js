// import { sleepTime } from "../Time/sleepTime.js";
// import { watchTime, holdForFewMinutes } from "../Time/waitingTime.js";
// import { SelectingBotForCampaign } from "../WhatsAppBot/SelectingBotForCampaign.js";
import { changeNormalNumberWithWhatsAppNumber } from "../Contacts/changeWhatsAppNumberWithNormalNumber.js"

export async function findAndCheckChat(Number, i, Time, WhatsAppBotClient) {
  let result = false;
  let iteration2 = i % Time.Agents;
  let waNumber = changeNormalNumberWithWhatsAppNumber(Number)

  console.log("Chat finding with contact's .......................", parseInt(Number))
  console.log("Chat finding with contact's .......................", (iteration2))


  // setTimeout(function () {
  //   sleepTime(1000)

  // }, 4000);
  try {
    // WhatsAppBotClient = await SelectingBotForCampaign(iteration2)
    // console.log("Chat finding with client's WhatsAppBotClient.authStrategy.clientId.......................", (WhatsAppBotClient.authStrategy.clientId))
    console.log("Chat finding with ------------- new 44444444444444's .......................")

    console.log("Chat finding with contact's .......................", (Number))
    console.log("Chat finding with WA Number contact's .......................", (waNumber))


    result = await WhatsAppBotClient.getChatById(Number)
    // console.log("Chat finding with contact's .......................", (result))

  } catch (error) {
    console.log(error)
  }
  // console.log("....... .......................this number has chat", result)
  return result
}
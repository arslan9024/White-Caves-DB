import { Anam } from "../server.js"
import { sleepTime, sleepTimeOfficalHoursWithRandomDelay } from "./sleepTime.js"
import { afternoonGreetingMessage } from "./messages.js";
import { findAndCheckChat } from "./FindAndCheckChat.js";
import { validateNumberWithCountryCode } from "./Contacts/validateNumberWithCountryCode.js";
export async function sendBroadcast(numbers, newChatsOnly = true) {
    console.clear()
    const message = afternoonGreetingMessage;
    let successes = 0
    let fails = 0

    console.log(numbers)
    for (let num of numbers) {
        console.log("in the for loop", num)
        let validatedContact = validateNumberWithCountryCode(num)
        try {
          
            console.log("The new chats only value is this in try catch ", newChatsOnly)
            const result = await Anam.getChatById(validatedContact)
            console.log("The new chats only value was true", result)
            console.log("the validated Number is", validatedContact)
           
            const validatedChatResult = await findAndCheckChat(result)
            // console.log("The new validated chat result is here", validatedChatResult)
                console.log(`The time now is ${new Date().toISOString().slice(11, 19)} o'clock`)
            if (newChatsOnly) {
                if (result?.timestamp) {
                    console.log('skipping-------------------------------------', validatedContact)
                    continue
                }
            }
            const SendReport = await Anam.sendMessage(validatedContact, message)
          
            successes++
            console.log(fails, 'failures')
            console.log(successes, ' Suceesses')
            console.log('sent, I will be sleeping after this number')
            console.log(SendReport.from, ' From this number we send')
            console.log(SendReport.to, ' to this number we send')



        } catch (error) {
            console.log(error)
            console.log(num, ' failed')
            fails++
        }
        await sleepTimeOfficalHoursWithRandomDelay(180000, 490000, 8, 19)
    }
    console.log(successes, ' succeeded')
    console.log(fails, ' failed')
    console.log("Hello My King, I have completed the CAMPAIGN. Kindly Give me another task now", Anam.info)
}
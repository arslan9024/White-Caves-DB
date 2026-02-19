import { Nawal } from "../server.js"
import { sleepTime, sleepTimeOfficalHoursWithRandomDelay } from "./sleepTime.js"
import { afternoonGreetingMessage } from "./messages.js";
import { findAndCheckChat } from "./FindAndCheckChat.js";
export async function sendBroadcast(numbers, newChatsOnly = true) {
    console.clear()
    const message = afternoonGreetingMessage;
    let successes = 0
    let fails = 0

    console.log(numbers)
    for (let num of numbers) {
        
        try {
            console.log("The new chats only value is this in try catch ", newChatsOnly)
            const result = await Nawal.getChatById(num)
            // console.log("The new chats only value was true", result)
           
            const validatedChatResult = await findAndCheckChat(result)
            // console.log("The new validated chat result is here", validatedChatResult)
                console.log(`The time now is ${new Date().toISOString().slice(11, 19)} o'clock`)
            if (newChatsOnly) {
                if (result?.timestamp) {
                    console.log('skipping-------------------------------------', num)
                    continue
                }
            }
            const SendReport = await Nawal.sendMessage(num, message)
          
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
        await sleepTimeOfficalHoursWithRandomDelay(120000, 590000, 8, 18)
    }
    console.log(successes, ' succeeded')
    console.log(fails, ' failed')
    console.log("Hello My King, I have completed the CAMPAIGN. Kindly Give me another task now", Nawal.info)
}
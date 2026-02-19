import { sleepTime } from "./sleepTime.js"

export const afternoonGreetingMessage = `Good afternoon 🌞
How are you doing today?


مساء الخير 🌞
كيف حالك اليوم؟`

export const messageMahmod = `Salam! Mahmoud here.


I'm a real estate agent, and I specialize in helping people find their dream homes. I saw that you're interested in buying or renting a property, and I'd love to chat with you more about your needs.


To get started, I'd like to ask you a few questions:


What's your name and nationality?
Are you buying with cash or mortgage?
Are you buying for personal use or investment?
Are you open to renting out the property or do you need it to be vacant?


Once I have this information, I can give you a more personalized recommendation and schedule a time to show you some properties that might be a good fit for you.


The market is hot right now, so don't wait to reach out! I'll do everything I can to help you find your dream home as quickly as possible.


I look forward to hearing from you soon!`

export const EveningGreeatingMessage=`Good Evening`
export const MorningGreetingMessage=`Good morning 🌞
How are you doing today?

صباح الخير 🌞
 كيف حالك اليوم؟`

export const NighGreetingMessage=`Good Night 🌞
How are you doing today?

 مساء الخير 🌞
 كيف حالك اليوم؟`


export async function findGreetingMessage(hour){
    console.clear()
    console.log(hour)
    sleepTime(1000);
    let message= "Hello"
    var morning   = (hour >= 8  && hour <= 11),
    afternoon = (hour >= 12 && hour <= 16),
    evening   = (hour >= 17 && hour <= 20),
    night     = (hour >= 21 || hour <= 7);

if(morning) {

  console.log("It's morning");
  message= MorningGreetingMessage

} else if(afternoon){

  console.log("It's afternoon");
  message= afternoonGreetingMessage

} else if(evening) {

  console.log("It's evening");
  message=EveningGreeatingMessage

} else if(night) {

  console.log("It's night");
  message= NighGreetingMessage

}
console.log( message)
return message
}

export const firstMessageToKing= "My king, Muko is here at your service.My love how are you doing? My king, thanks for waking me up"

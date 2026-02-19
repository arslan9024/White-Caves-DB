import { sleepTime } from "./sleepTime.js"
import { watchTime, holdForFewMinutes } from "./waitingTime.js";

export async function findAndCheckChat(result) {
    console.log("Chat result with person's name.......................", result.name)
     setTimeout(function(){
        sleepTime(10000)

  }, 4000 );
    console.log("....... .......................this person has number", result.id.user)
    return result
}
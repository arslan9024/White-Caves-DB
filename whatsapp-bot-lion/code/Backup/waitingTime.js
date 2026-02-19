import { sleepTime } from "./sleepTime.js"

export async function findAndCheckChat(result) {
    console.clear()
       const hours = new Date().getHours();   
       const minutes = new Date().getMinutes();

    console.log(`The time now is ${new Date(ms).toISOString().slice(11, 19)} o'clock`)
}
export async function watchTime() {
    let WatchTimeResult;
       const hours = new Date().getHours();   
       const minutes = new Date().getMinutes();
    console.log(`The time now is ${hours}:${minutes} o'clock`)
    return WatchTimeResult={hours, minutes}
}
export async function holdForFewMinutes(ms) {
            await sleepTime(ms)

 console.log(`I am holding for few minutes ${ms/(60*1000)} `)
    
}
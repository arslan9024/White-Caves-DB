
import { convertMsToTime,  toMilliseconds} from "./convertTime.js"
export const SleepTimeOfficialHoursWithRandomDelay = (Time) => new Promise((resolve, reject) => { 
            // console.log("Total details for timing",Time);

    let delay = Math.floor((Math.random() * (Time.MinimumTimeGap)) + (Time.MinimumTimeGap));
    let nightDelay;
    let shiftEnd=Time.ShiftEnd;
    let shiftStart=Time.ShiftStart
    const hours = new Date().getHours();
    shiftStart>hours ?  nightDelay= (shiftStart-hours) : nightDelay= (24-(hours-shiftStart))
    const isNightTime = hours > shiftEnd || hours < shiftStart;
    if (isNightTime === true) {
        setTimeout(resolve, toMilliseconds(nightDelay, 1, 1))
        console.log("As it is night time, i will sleep, and tomorrow i will this messages to remaining clients", nightDelay);
    }
    else{
    console.log(`"As it is day time, i will send a message to this client in few seconds. The time now is \u001b[31m${new Date().toLocaleTimeString()}\u001b[0m o'clock"`);
    console.log(`There will be still a little delay of \u001b[32m${convertMsToTime(delay/Time.Speed)}\u001b[0m  to keep the Bot Alive and breathing!!!`);
    setTimeout(resolve, delay/Time.Speed);
    }
})

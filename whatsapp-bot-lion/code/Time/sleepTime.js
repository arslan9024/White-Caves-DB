export const sleepTime = (ms) => new Promise((resolve, reject) => {
    // console.log("I will sleep now for 3 minutes to help you")
    setTimeout(resolve, ms)
})

export const sleepTimeOfficalHours = () => new Promise((resolve, reject) => {
    // setTimeout(resolve, ms);
    const nighthours = 43200000;
    let delay = Math.floor((Math.random() * 4800000) + 600000)
    const hours = new Date().getHours();


    if (isDayTime === true) {
        console.log("As it is day time, i will send a message to this client. The clock hour is", hours);
        console.log("There will be still a little dealy to keep the Bot Alive and breating for this seconds", delay / 1000);
        setTimeout(resolve, delay);


    } else if (isNightTime === true) {
        console.log("As it is night time, i will sleeping for the nighthours and tomorrow i will this messages to remaining clients", nighthours);
        setTimeout(resolve, nighthours);

    }
})

export const sleepTimeExeptOfficialHours = () => new Promise((resolve, reject) => {

    const nighthours = 43200000;
    //43200 = seconds equals 12 hours
    //43200000= 12 hours
    let delay = Math.floor((Math.random() * 33000) + 8000)
    console.log("Night time delay will be 12 hours", nighthours);
    console.log('sent---------------, sleeping for', delay)

    setInterval(function () { // Set interval for checking
        var date = new Date(); // Create a Date object to find out what time it is
        if (date.getHours() === 22 && date.getMinutes() === 0) { // Check the time
            // Do stuff
            setTimeout(resolve, nighthours)
        }
        setTimeout(resolve, delay)
    }, 60000); // Repeat every 60000 milliseconds (1 minute)

})
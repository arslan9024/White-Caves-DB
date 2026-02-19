import { sleepTime } from '../Time/sleepTime.js';
import countryPhoneCodes from "../Contacts/countryPhoneCodes.json" assert { type: "json" };
import UAEMobileNetworkCodes from "../Contacts/UAEMobileNetworkCodes.json" assert { type: "json" };

export async function getPhoneNumbersArrayFromRows(Rows) {
        console.log(`in sheet find numbers`);
let rows = Rows.length;
    let Numbers = [...new Set([])];
    let CorrectNumbers = [...new Set([])];
    let HalfCorrectNumbers = [...new Set([])];
    let updatedUAENumbers = [...new Set([])];


    let WrongNumbers = [];
    for (const [key, value] of Object.entries(Rows)) {
        // console.log(`${key[0]}: ${value[0]}`);
        // console.log(value[5])
        
        // console.log("Mobile Number for the owner", value[7])
        sleepTime(1000);
        let Phone = await (value[5]);

        let Mobile = await (value[7]);
        let SecondaryMobile = await (value[8]);
        let Number = (
            String(Phone) || Phone ||
            String(Mobile) || Mobile || 
            String(SecondaryMobile) || SecondaryMobile || '')
        .replace(/[^\d]/g, '')
        .replace(/^0+|(?<=971)0+/g, "")
        let foundedCountryCode = countryPhoneCodes.find(element => Number.startsWith(element.code))
        let foundUAEMobileCode = UAEMobileNetworkCodes.find(element => Number.startsWith(element.CellPhoneCode))
        if (Number.length < 9) {
            WrongNumbers.push(Number)
        }
        else if (Number.length > 10 && foundedCountryCode) {
            // console.log(`the number ${Number} and the country code founded${foundedCountryCode}
            //     the length of number is ${Number.length}`)
            CorrectNumbers.push(Number)

        }
        else if (Number.length == 9 && foundUAEMobileCode) {
            let newNumber = '971' + Number
            // console.log(`the updated number with UAE code correction 
            //     ${newNumber} and the mobile code${foundUAEMobileCode}
            //     the length of number is ${newNumber.length}`)
            updatedUAENumbers.push(newNumber)
        }
        else {
            HalfCorrectNumbers.push(Number)
            // if (Number.length < 9) {
            //     let newNumber = '971' + Number
            //     // console.log(`the number correction 11,,,,,,,,,,,,
            //     // ${newNumber} and the country code${foundedCountryCode}
            //     // the length of number is ${newNumber.length}`)
            //     Numbers.push(newNumber)
            // }
            // else if (Number.length == 9) {
            //     let newNumber = '971' + Number
            //     // console.log(`the number correction 11,,,,,,,,,,,,
            //     // ${newNumber} and the country code${foundedCountryCode}
            //     // the length of number is ${newNumber.length}`)
            //     Numbers.push(newNumber)
            // }
            // else {
            //     let newNumber = '971' + Number
            //     // console.log(`the number correction 13,,,,,,,,,,,,
            //     // ${newNumber} and the country code${foundedCountryCode}
            //     // the length of number is ${newNumber.length}`)
            //     Numbers.push(newNumber)

            // }
        }
        // console.log("The country code", foundedCountryCode)
        // console.log("the number is after replacements ", Numbers)

    }
    //   console.log(" Numbers", {
    //     CorrectNumbers,
    //     WrongNumbers,
    //     HalfCorrectNumbers
    // });

    return {
        rows,
        CorrectNumbers,
        WrongNumbers,
        HalfCorrectNumbers,
        updatedUAENumbers
    }
}
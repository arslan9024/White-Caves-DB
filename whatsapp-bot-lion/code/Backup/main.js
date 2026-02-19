import {google} from 'googleapis';
import keys from "./googleSheets/keys.json" assert { type: "json" };
export const PowerAgent = new google.auth.JWT(
    keys.client_email, 
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'] 
);
PowerAgent.authorize(function(err, tokens){
// console.log(keys)
    if(err){
        console.log(err);
        return;
    } else{
        console.log("connected")
    }
});


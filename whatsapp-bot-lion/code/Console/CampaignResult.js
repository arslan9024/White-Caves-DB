import { SelectingBotForCampaign } from "../../Inputs/SelectingBotForCampaign.js";


export function CampaignResult(SendReport, Project, successes, skipped, fails, numbers, i) {
    console.log("The iteration of the message", parseInt(i));
    console.log("From", parseInt(SendReport.from), ", To Number", parseInt(SendReport.to), "with length", SendReport.to.length - 5);
    console.log(`The Project name is \u001b[44m${Project.ProjectName}\u001b[0m with total numbers`, numbers.length);
    console.log(`The \u001b[42m Successes are ${successes}\u001b[0m and The \u001b[41m failures are ${fails}\u001b[0m`);
    console.log(`\u001b[34m"Skipped",${skipped}\u001b[0m, "remaining" \u001b[34m${numbers.length - (fails + successes + skipped)}\u001b[0m and I will be resting after this number`);
    return true;
}
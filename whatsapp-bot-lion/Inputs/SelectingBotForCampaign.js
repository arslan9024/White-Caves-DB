import {
  Lion0,
} from "../index.js";

// const  = pack;
export async function SelectingBotForCampaign(Iteration) {
  let RegisteredAgentWAClient;

  console.log("This is the iteration in the campaign _________xxxxxxx_______________", Iteration);

  try {
    console.log("The switch is finding client bot.....................***************************");
    switch (Iteration) {
      case 0:
        RegisteredAgentWAClient = Lion0;
        break;
      case 1:
        // RegisteredAgentWAClient = Lion1;
        break;
      case 2:
        // RegisteredAgentWAClient = Lion2;
        break;
      case 3:
        // RegisteredAgentWAClient = Lion3;
        break;

      case 4:
        // RegisteredAgentWAClient = Lion4;
        break;
      case 5:
        // RegisteredAgentWAClient = Lion5;
        break;
      case 6:
        // RegisteredAgentWAClient = Lion6;
        break;
      case 7:
        // RegisteredAgentWAClient = Lion7;
        break;
      case 8:
        // RegisteredAgentWAClient = Lion8;
        break;
      // case 9:
      //   RegisteredAgentWAClient = Samy;
      //   break;

      default:
        RegisteredAgentWAClient = Lion0;
    }
  } catch (error) {
    console.log(error);
  }
  return RegisteredAgentWAClient;

}

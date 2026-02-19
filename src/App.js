import logo from './WCLogo.png';
import './App.css';

/**bot part */
import { WhatsAppClientFunctions } from "../whatsapp-bot-lion/code/WhatsAppBot/WhatsAppClientFunctions.js";
// import { CreatingNewWhatsAppClient } from                 "./code/WhatsAppBot/CreatingNewWhatsAppClient.js";
import { CreatingNewWhatsAppClient } from "../whatsapp-bot-lion/code/WhatsAppBot/CreatingNewWhatsAppClient.js";

import { Agents} from "../whatsapp-bot-lion/Inputs/WCNumber.js";
export const Lion0 = await CreatingNewWhatsAppClient(Agents.Agent0.Number);

function App() {
WhatsAppClientFunctions(Lion0, Agents.Agent0.Number, true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          The website is under construction. For all your inquiries kindly send a message.
        
        </p>
        <a
          className="App-link"
          href="https://api.whatsapp.com/send/?phone=971565268356&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Send Message on WhatsApp
        </a>
      </header>
    </div>
  );
}

export default App;

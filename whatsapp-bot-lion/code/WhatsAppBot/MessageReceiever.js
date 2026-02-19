

// const  = pack;
export async function MessageReceiever(msg) {
    let result;

    console.log("This is the iteration in the campaign", msg);


    try {

        console.log("The switch is finding client bot");
        switch (msg.body) {
            case 0:
                result = "0";
                break;
            case 1:
                result = "1";
                break;
            case 2:
                result = "2";
                break;
            default:
                result = "0";
        }
        return result;


    } catch (error) {
        console.log(error)
    }




}
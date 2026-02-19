export async function ReplaceContact(Number) {
let NewNumber;
    try {
        NewNumber = (String(Number) || Number || '')
        .replace(/[^\d]/g, '')
        .replace(/^0+|(?<=971)0+/g, "")
    } catch (error) {
        console.log(error)
    }
        console.log("The Number after Replacement", NewNumber)

    return NewNumber;

}
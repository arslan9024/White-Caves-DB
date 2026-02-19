export async function ShuffleMyArray(MNumbers) {
    let numbers;
    try {
        numbers=await MNumbers.sort(() => Math.random() - 0.5);
        return numbers
    } catch (error) {
        console.log(error)
    }
}

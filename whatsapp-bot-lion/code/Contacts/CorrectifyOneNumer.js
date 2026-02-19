export const CorrectifyOneNumer = (Number) => {
    console.log("in CorrectifyOneNumer,,,,,,,,,,,,,,,", Number)

let res = Number.replace(/[^\d]/g, '').replace(/^0+|(?<=971)0+/g, "")
    console.log("in CorrectifyOneNumer before return", res)


return res
}

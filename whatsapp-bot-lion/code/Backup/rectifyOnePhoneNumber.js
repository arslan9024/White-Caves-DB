export const rectifyOneClientNumber = (row) => {
    // console.log("in loop", row)
    // console.log("in loop", row.MOBILE)
    // console.log("in loop", row['SECONDARY MOBILE'])

let res = (row.MOBILE || row['SECONDARY MOBILE'] || '').replace(/[^\d]/g, '').replace(/^0+|(?<=971)0+/g, "")
    console.log("in loop", res)

if (res.length > 5 
    && !res.startsWith('9') 
    && !res.startsWith('2') 
    && !res.startsWith('34') 
    && !res.startsWith('4') 
    && !res.startsWith('861'))
    {
        res = '971' + res
    }
return res
}

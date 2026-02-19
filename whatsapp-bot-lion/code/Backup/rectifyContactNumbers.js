export const rectifyCorrectNumbers = (data) => data.map(row => {
    console.log("to check the row of the row", row)

    console.log("to check the row of the row.mobile", String(row.MOBILE))
    console.log("to check the row of the row.mobile", row['Mobile'])

    let res = (String(row.MOBILE) || row['MOBILE 2']|| row['SECONDARY MOBILE'] || '')
    .replace(/[^\d]/g, '')
    .replace(/^0+|(?<=971)0+/g, "")
    // const res = num.replace(/[^\d]/g, '').replace(/^0+|(?<=971)0+/g, "")
    if (res.length > 5 
        && !res.startsWith('92') 
        && !res.startsWith('91')
        && !res.startsWith('971') 
        && !res.startsWith('9') 
        && !res.startsWith('20') 
        && !res.startsWith('34') 
        && !res.startsWith('1') 
        && !res.startsWith('43')
        && !res.startsWith('44') 
        && !res.startsWith('966') 
        && !res.startsWith('964') 
        && !res.startsWith('965') 
        && !res.startsWith('88') 
        && !res.startsWith('86'))
        {
            res = '971' + res
        }
    return res
    }).filter(val => val.length > 7)


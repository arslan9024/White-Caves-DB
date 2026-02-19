export const validateContactNumber= (Number) => {
    let res = (String(Number) || Number || '')
    .replace(/[^\d]/g, '')
    .replace(/^0+|(?<=971)0+/g, "")
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

    console.log("The Contact in the validation function ", res)

    return `${res}@c.us`


}


export async function FindPropertiesInGoogleSheet(Rows) {
    let rowHeadings;
    try {
        console.log("Trying to find the rows headings", Rows[0]);

    rowHeadings=Rows[0]
    } catch (error) {
        console.log(error)
    }
    return rowHeadings;
}
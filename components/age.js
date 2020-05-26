export default (day, month, year) => {
    const now = new Date;
    const daysDiff = now.getDate() - day;
    let monthsDiff = now.getMonth() + 1 - month;
    let yearDiff = now.getFullYear() - year;
    if(daysDiff < 0) monthsDiff--;
    if(monthsDiff < 0) yearDiff--;
    return yearDiff
}

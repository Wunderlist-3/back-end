module.exports = (req, res, next) => {
    const now = Date.now();
    var offset = new Date().getTimezoneOffset();
    const date = new Date(now + (offset));
    const dateStr = date.toUTCString().toLowerCase();
    console.log('date', dateStr);
    const weekDay = dateStr.split("").splice(0,3).join("");
    const month = dateStr.split(" ")[2];
    const day = dateStr.split(" ")[1];
    const dateObj = {
        day,
        weekDay,
        month
    }
    req.dateObj = dateObj;
    console.log(dateStr)
    
    // console.log('the offset', offset);
    // console.log('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)


// const options = {
//     weekday: 'long',
//     month: 'long',
//     day: 'long'
// }
// const dateStr = date.toLocaleString('en-us', options);

// console.log(dateStr);

    next();
}
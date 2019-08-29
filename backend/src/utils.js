const DateFns = require('date-fns');

/**
 * Converts the date to a string
 * @param {Date} date 
 * @returns {string} the date in string format (ex. Jul 25, 2019)
 */
function convertDateToString(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

/**
 * Subtract a number of months from today and return the first day of that month
 * @param {number} monthsToSubtract 
 */
function getPastMonth(monthsToSubtract) {
    return DateFns.startOfMonth(DateFns.subMonths(Date.now(), monthsToSubtract));
}

/**
 * Get the first day of the next month
 */
function getNextMonth(date) {
    if (!date) date = Date.now();
    return DateFns.addMonths(DateFns.startOfMonth(date), 1);
}

/**
 * Get the month name
 * @param {number} month 
 * @returns {string}
 */
function getMonthName(month) {
    return DateFns.format((new Date()).setMonth(month), 'MMM');
}

/**
 * Returns an array of the numbers for the last n months 
 * @param {number} n
 * @returns {[number]} 
 */
function getLastMonths(n) {
    const months = [];
    let date = new Date();
    for (let i = 0; i < n; i++) {
        months.push(date.getMonth());
        date = DateFns.subMonths(date, 1);
    }
    return months;
}

/**
 * Logs the error and returns a response with status 500
 * @param {*} response 
 * @param {*} error 
 */
function handleError(response, error) {
    console.log(error);
    return response.status(500).json('An error occured')
}

module.exports = { convertDateToString, getPastMonth, getNextMonth, getMonthName, getLastMonths, handleError };

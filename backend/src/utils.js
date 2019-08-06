/**
 * Converts the date to a string
 * @param {Date} date 
 * @returns {string} the date in string format (ex. Jul 25, 2019)
 */
function convertDateToString(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

module.exports = { convertDateToString };

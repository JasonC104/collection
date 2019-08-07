/**
 * Converts the date to a string
 * @param {Date} date 
 * @returns {string} the date in string format (ex. Jul 25, 2019)
 */
function convertDateToString(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
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

module.exports = { convertDateToString, handleError };

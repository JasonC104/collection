function convertDateToString(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

module.exports = { convertDateToString };

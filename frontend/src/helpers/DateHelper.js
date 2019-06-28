import { startOfMonth, subMonths } from 'date-fns'

export function getLastMonths(n) {
    const months = [];
    let date = new Date();
    for (let i = 0; i < n; i++) {
        months.push(startOfMonth(date));
        date = subMonths(date, 1);
    }
    return months;
}

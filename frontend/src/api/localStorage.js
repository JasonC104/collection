export function get(key, defaultValue={}) {
    let storedItem = defaultValue;
    if (global.localStorage) {
        try {
            storedItem = JSON.parse(global.localStorage.getItem(key)) || defaultValue;
        } catch (e) {
        }
    }
    return storedItem;
}

export function save(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(key, JSON.stringify(value));
    }
}

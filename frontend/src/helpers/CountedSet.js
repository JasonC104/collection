class CountedSet {

    constructor() {
        this.data = {}
    }

    add(element) {
        if (element in this.data) {
            this.data[element]++;
        } else {
            this.data[element] = 1;
        }
    }

    get(key) {
        return this.data[key];
    }

    entries() {
        return Object.entries(this.data);
    }

}

export default CountedSet;

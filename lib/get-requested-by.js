import assert from 'assert';

export default class PodiumContextRequestedByParser {
    constructor({ name } = {}) {
        assert(name, 'You must provide a value to "name".');

        Object.defineProperty(this, 'name', {
            value: name,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextRequestedByParser';
    }

    parse() {
        return this.name;
    }
};

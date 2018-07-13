'use strict';

const assert = require('assert');

const PodiumContextRequestedByParser = class PodiumContextRequestedByParser {
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

module.exports = PodiumContextRequestedByParser;

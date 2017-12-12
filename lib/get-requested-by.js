'use strict';

const assert = require('assert');

module.exports = class ContextRequestedByParser {
    constructor(name) {
        assert(name, 'You must provide a value to "name".');

        Object.defineProperty(this, 'name', {
            value: name,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextRequestedByParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.name);
        });
    }
};

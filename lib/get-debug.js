'use strict';

const assert = require('assert');

module.exports = class ContextDebugParser {
    constructor(enabled = false) {
        assert.equal(typeof enabled, 'boolean', 'The value provided must be a boolean value.');

        Object.defineProperty(this, 'default', {
            value: enabled.toString(),
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextDebugParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.default);
        });
    }
};

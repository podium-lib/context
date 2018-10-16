'use strict';

const assert = require('assert');

const PodiumContextDebugParser = class PodiumContextDebugParser {
    constructor({ enabled = false } = {}) {
        assert.equal(
            typeof enabled,
            'boolean',
            'The value provided must be a boolean value.',
        );

        Object.defineProperty(this, 'default', {
            value: enabled.toString(),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextDebugParser';
    }

    parse() {
        return this.default;
    }
};

module.exports = PodiumContextDebugParser;

'use strict';

module.exports = class ContextDebugParser {
    constructor() {
        Object.defineProperty(this, 'default', {
            value: 'false',
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

'use strict';

module.exports = class ContextCdnHostParser {
    constructor(host = 'https://static.finncdn.no') {
        Object.defineProperty(this, 'default', {
            value: host,
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

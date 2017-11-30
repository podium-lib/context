'use strict';

module.exports = class ContextBaseUrlParser {
    constructor(uri = '') {
        Object.defineProperty(this, 'default', {
            value: uri,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextBaseUrlParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.default);
        });
    }
};

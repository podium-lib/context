'use strict';

module.exports = class ContextLocaleParser {
    constructor() {
        Object.defineProperty(this, 'default', {
            value: 'en_GB',
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextLocaleParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.default);
        });
    }
};

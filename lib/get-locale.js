'use strict';

const bcp47 = require('bcp47-validate');

module.exports = class ContextLocaleParser {
    constructor({defaultLocale = 'nb-NO'} = {}) {
        if (!bcp47.validate(defaultLocale)) {
            throw new Error(
                `Value provided to "defaultLocale" is not a valid locale: ${defaultLocale}`
            );
        }

        Object.defineProperty(this, 'defaultLocale', {
            value: defaultLocale,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextLocaleParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.defaultLocale);
        });
    }
};

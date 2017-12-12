'use strict';

const bcp47 = require('bcp47-validate');

module.exports = class ContextLocaleParser {
    constructor(locale = 'en-EN') {
        if (!bcp47.validate(locale)) {
            throw new Error(
                `Value provided to "locale" is not a valid locale: ${locale}`
            );
        }

        Object.defineProperty(this, 'locale', {
            value: locale,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextLocaleParser';
    }

    parse(req = {}, res = {}) {
        return new Promise(resolve => {
            if (res.locals && res.locals.locale) {
                resolve(res.locals.locale);
                return;
            }
            resolve(this.locale);
        });
    }
};

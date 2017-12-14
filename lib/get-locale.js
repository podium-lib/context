'use strict';

const assert = require('assert');
const bcp47 = require('bcp47-validate');

module.exports = class ContextLocaleParser {
    constructor(locale = 'en-EN') {
        assert.equal(bcp47.validate(locale), true, `Value provided to "locale" is not a valid locale: ${locale}`);

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

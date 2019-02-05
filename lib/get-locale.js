'use strict';

const assert = require('assert');
const bcp47 = require('bcp47-validate');

const PodiumContextLocaleParser = class PodiumContextLocaleParser {
    constructor({ locale = 'en-US' } = {}) {
        assert.equal(
            bcp47.validate(locale),
            true,
            `Value provided to "locale" is not a valid locale: ${locale}`,
        );

        Object.defineProperty(this, 'locale', {
            value: locale,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextLocaleParser';
    }

    parse(incoming = {}) {
        if (incoming.params && incoming.params.locale) {
            return incoming.params.locale;
        }

        return this.locale;
    }
};

module.exports = PodiumContextLocaleParser;

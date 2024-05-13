import assert from 'assert';
import bcp47 from 'bcp47-validate';

/**
 * @typedef {object} PodiumContextLocaleParserOptions
 * @property {string} [locale='en-US']
 */

export default class PodiumContextLocaleParser {
    /**
     * @constructor
     * @param {PodiumContextLocaleParserOptions} options
     */
    constructor({ locale = 'en-US' } = {}) {
        assert.strictEqual(
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

        // @ts-expect-error because of Object.defineProperty
        return this.locale;
    }
}

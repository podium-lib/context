import assert from 'assert';
import bcp47 from 'bcp47-validate';

export default class PodiumContextLocaleParser {
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

        return this.locale;
    }
};

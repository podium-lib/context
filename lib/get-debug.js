import assert from 'assert';

/**
 * @typedef {object} PodiumContextDebugParserOptions
 * @property {boolean} [enabled=false]
 */

export default class PodiumContextDebugParser {
    /**
     * @constructor
     * @param {PodiumContextDebugParserOptions} [options]
     */
    constructor({ enabled = false } = {}) {
        assert.strictEqual(
            typeof enabled,
            'boolean',
            'The value provided must be a boolean value.',
        );

        Object.defineProperty(this, 'default', {
            value: enabled.toString(),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextDebugParser';
    }

    parse() {
        // @ts-expect-error because of Object.defineProperty
        return this.default;
    }
}

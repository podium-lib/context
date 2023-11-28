import assert from 'assert';

export default class PodiumContextDebugParser {
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
        return this.default;
    }
};

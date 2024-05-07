import assert from 'assert';

/**
 * @typedef {object} PodiumContextRequestedByParserOptions
 * @property {string} name
 */

export default class PodiumContextRequestedByParser {
    /**
     * @constructor
     * @param {PodiumContextRequestedByParserOptions} options
     */
    // @ts-expect-error
    constructor({ name } = {}) {
        assert(name, 'You must provide a value to "name".');

        Object.defineProperty(this, 'name', {
            value: name,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextRequestedByParser';
    }

    parse() {
        // @ts-expect-error because of Object.defineProperty
        return this.name;
    }
}

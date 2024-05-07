import { pathnameBuilder } from '@podium/utils';

/**
 * @typedef {object} PodiumContextMountPathnameParserOptions
 * @property {string} [pathname='/']
 */

export default class PodiumContextMountPathnameParser {
    /**
     * @constructor
     * @param {PodiumContextMountPathnameParserOptions} options
     */
    constructor({ pathname = '/' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: pathname,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountPathnameParser';
    }

    parse() {
        // @ts-expect-error because of Object.defineProperty
        return pathnameBuilder(this.pathname);
    }
}

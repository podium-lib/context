import { pathnameBuilder } from '@podium/utils';

/**
 * @typedef {object} PodiumContextPublicPathnameParserOptions
 * @property {string} [pathname='/']
 * @property {string} [prefix='podium-resource']
 */

export default class PodiumContextPublicPathnameParser {
    /**
     * @constructor
     * @param {PodiumContextPublicPathnameParserOptions} options
     */
    constructor({ pathname = '/', prefix = 'podium-resource' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: pathname,
        });

        Object.defineProperty(this, 'prefix', {
            value: prefix,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextPublicPathnameParser';
    }

    parse() {
        return (name = '/') =>
            // @ts-expect-error because of Object.defineProperty
            pathnameBuilder(this.pathname, this.prefix, name);
    }
}

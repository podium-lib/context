'use strict';

const _stripFragment = Symbol('_stripFragment');
const _padFragment = Symbol('_padFragment');

const PodiumContextPublicPathnameParser = class PodiumContextPublicPathnameParser {
    constructor({ pathname = '/', prefix = 'podium-resource' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: this[_padFragment](pathname),
        });

        Object.defineProperty(this, 'prefix', {
            value: this[_stripFragment](prefix),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextPublicPathnameParser';
    }

    [_padFragment](fragment) {
        if (!fragment.startsWith('/')) {
            fragment = `/${fragment}`;
        }

        if (!fragment.endsWith('/')) {
            fragment = `${fragment}/`;
        }

        return fragment;
    }

    [_stripFragment](fragment) {
        if (fragment.startsWith('/')) {
            fragment = fragment.substr(1);
        }

        if (fragment.endsWith('/')) {
            fragment = fragment.substr(0, fragment.length - 1);
        }

        return fragment;
    }

    parse() {
        return new Promise(resolve => {
            const resolver = (name = '/') => {
                name = this[_padFragment](name);
                return `${this.pathname}${this.prefix}${name}`;
            };
            resolve(resolver);
        });
    }
};

module.exports = PodiumContextPublicPathnameParser;

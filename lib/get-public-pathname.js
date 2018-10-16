'use strict';

const symStripFragment = Symbol('_stripFragment');
const symFragment = Symbol('_padFragment');

const PodiumContextPublicPathnameParser = class PodiumContextPublicPathnameParser {
    constructor({ pathname = '/', prefix = 'podium-resource' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: this[symFragment](pathname),
        });

        Object.defineProperty(this, 'prefix', {
            value: this[symStripFragment](prefix),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextPublicPathnameParser';
    }

    [symFragment](fragment) {
        let str = fragment;

        if (!str.startsWith('/')) {
            str = `/${str}`;
        }

        if (!str.endsWith('/')) {
            str = `${str}/`;
        }

        return str;
    }

    [symStripFragment](fragment) {
        let str = fragment;

        if (str.startsWith('/')) {
            str = str.substr(1);
        }

        if (str.endsWith('/')) {
            str = str.substr(0, str.length - 1);
        }

        return str;
    }

    parse() {
        return (name = '/') => {
            const str = this[symFragment](name);
            return `${this.pathname}${this.prefix}${str}`;
        };
    }
};

module.exports = PodiumContextPublicPathnameParser;

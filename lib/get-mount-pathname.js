'use strict';

const PodiumContextMountPathnameParser = class PodiumContextMountPathnameParser {
    constructor({ pathname = '/' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: pathname,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountPathnameParser';
    }

    parse() {
        return this.pathname;
    }
};

module.exports = PodiumContextMountPathnameParser;

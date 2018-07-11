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
        return new Promise(resolve => {
            resolve(this.pathname);
        });
    }
};

module.exports = PodiumContextMountPathnameParser;

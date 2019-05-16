'use strict';

const { pathnameBuilder } = require('@podium/utils');

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
        return pathnameBuilder(this.pathname);
    }
};

module.exports = PodiumContextMountPathnameParser;

'use strict';

const { pathnameBuilder } = require('@podium/utils');

const PodiumContextPublicPathnameParser = class PodiumContextPublicPathnameParser {
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
        return (name = '/') => {
            return pathnameBuilder(this.pathname, this.prefix, name);
        };
    }
};

module.exports = PodiumContextPublicPathnameParser;

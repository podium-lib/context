'use strict';

const bowser = require('bowser');
const lru = require('lru-cache');

const _capabilitiesToType = Symbol('_capabilitiesToType');

const PodiumContextDeviceTypeParser = class PodiumContextDeviceTypeParser {
    constructor({ cacheSize = 10000 } = {}) {
        Object.defineProperty(this, 'default', {
            value: 'desktop',
        });

        Object.defineProperty(this, 'cacheSize', {
            value: cacheSize,
        });

        Object.defineProperty(this, 'cache', {
            value: lru({
                max: this.cacheSize,
            }),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextDeviceTypeParser';
    }

    [_capabilitiesToType](capabilities) {
        if (capabilities.mobile) {
            return 'mobile';
        }
        if (capabilities.tablet) {
            return 'tablet';
        }
        return this.default;
    }

    parse(req) {
        const userAgent = req.headers ? req.headers['user-agent'] : '';

        if (!userAgent || userAgent === '') {
            return this.default;
        }

        let type = this.cache.get(userAgent.toLowerCase());

        /* istanbul ignore next */
        if (!type) {
            const capabilities = bowser._detect(userAgent);
            type = this[_capabilitiesToType](capabilities);
            this.cache.set(userAgent.toLowerCase(), type);
        }

        return type;
    }

    statistics() {
        return {
            cacheItems: this.cache.itemCount,
        };
    }
};

module.exports = PodiumContextDeviceTypeParser;

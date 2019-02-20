'use strict';

const Bowser = require('bowser');
const LRU = require('lru-cache');

const symCapabilitiesToType = Symbol('_capabilitiesToType');

const PodiumContextDeviceTypeParser = class PodiumContextDeviceTypeParser {
    constructor({ cacheSize = 10000 } = {}) {
        Object.defineProperty(this, 'default', {
            value: 'desktop',
        });

        Object.defineProperty(this, 'cacheSize', {
            value: cacheSize,
        });

        Object.defineProperty(this, 'cache', {
            value: new LRU({
                max: this.cacheSize,
            }),
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextDeviceTypeParser';
    }

    [symCapabilitiesToType](platformType) {
        if (platformType === 'mobile') {
            return 'mobile';
        }
        if (platformType === 'tablet') {
            return 'tablet';
        }
        return this.default;
    }

    parse(incoming = {}) {
        const userAgent = incoming.request.headers
            ? incoming.request.headers['user-agent']
            : '';

        if (!userAgent || userAgent === '') {
            return this.default;
        }

        let type = this.cache.get(userAgent.toLowerCase());

        /* istanbul ignore next */
        if (!type) {
            // eslint-disable-next-line no-underscore-dangle
            const capabilities = Bowser.getParser(userAgent);
            const platformType = capabilities.getPlatformType();
            type = this[symCapabilitiesToType](platformType);
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

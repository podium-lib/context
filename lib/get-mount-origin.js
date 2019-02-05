'use strict';

const { URL } = require('url');

const PodiumContextMountOriginParser = class PodiumContextMountOriginParser {
    constructor({ origin = null } = {}) {
        Object.defineProperty(this, 'defaultOrigin', {
            value: origin ? new URL(origin) : {},
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountOriginParser';
    }

    parse(incoming = {}) {
        let { protocol, hostname } = incoming.url;
        let port = incoming.url.port ? incoming.url.port.toString() : '';

        if (this.defaultOrigin.hostname) {
            ({ hostname, protocol, port } = this.defaultOrigin);
        }

        if (port === '80' || port === '443') {
            port = '';
        }

        if (port) {
            port = `:${port}`;
        }

        return `${protocol}//${hostname}${port}`;
    }
};

module.exports = PodiumContextMountOriginParser;

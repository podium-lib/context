'use strict';

const originalUrl = require('original-url');
const { URL } = require('url');

const PodiumContextMountOriginParser = class PodiumContextMountOriginParser {
    constructor(mountOrigin = null) {
        Object.defineProperty(this, 'defaultOrigin', {
            value: mountOrigin ? new URL(mountOrigin) : {},
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountOriginParser';
    }

    parse(req) {
        return new Promise(resolve => {
            const url = originalUrl(req);

            let protocol = url.protocol;
            let hostname = url.hostname;
            let port = url.port ? url.port.toString() : '';

            if (this.defaultOrigin.hostname) {
                hostname = this.defaultOrigin.hostname;
                protocol = this.defaultOrigin.protocol;
                port = this.defaultOrigin.port;
            }

            if (port === '80' || port === '443') {
                port = '';
            }

            if (port) {
                port = `:${port}`;
            }

            resolve(`${protocol}//${hostname}${port}`);
        });
    }
};

module.exports = PodiumContextMountOriginParser;

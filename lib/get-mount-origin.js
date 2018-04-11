'use strict';

const { URL } = require('url');

const PodiumContextMountOriginParser = class PodiumContextMountOriginParser {
    constructor(mountOrigin = null) {
        Object.defineProperty(this, 'mount', {
            value: mountOrigin ? new URL(mountOrigin) : {},
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountOriginParser';
    }

    parse(req) {
        return new Promise(resolve => {
            const hostArr =
                req.headers && req.headers.host
                    ? req.headers.host.split(':')
                    : ['localhost'];
            let protocol = req.protocol ? req.protocol : 'http:';
            let hostname = hostArr[0];
            let port = hostArr[1] ? hostArr[1] : '';

            if (this.mount.hostname) {
                hostname = this.mount.hostname;
                protocol = this.mount.protocol;
                port = this.mount.port;
            }

            if (port === '80' || port === '443') {
                port = '';
            }

            if (port) {
                port = `:${port}`;
            }

            protocol = protocol.split(':')[0];

            resolve(`${protocol}://${hostname}${port}`);
        });
    }
};

module.exports = PodiumContextMountOriginParser;

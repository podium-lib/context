'use strict';

const PodiumContextMountOriginParser = class PodiumContextMountOriginParser {
    constructor(mount = {}) {
        Object.defineProperty(this, 'mount', {
            value: mount,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountOriginParser';
    }

    parse(req) {
        return new Promise(resolve => {
            // This could be implemented simpler and better with the WHATWG URL module,
            // but its not done due to this memory leak fix not landed in node in the
            // time of writing: https://github.com/nodejs/node/issues/17448
            // trygve.lie@finn.no 2017.12.20
            const hostArr =
                req.headers && req.headers.host
                    ? req.headers.host.split(':')
                    : ['localhost'];
            let protocol = req.protocol ? req.protocol : 'http:';
            let hostname = hostArr[0];
            let port = hostArr[1] ? `:${hostArr[1]}` : '';

            if (this.mount.protocol) {
                protocol = this.mount.protocol;
            }

            if (this.mount.hostname) {
                hostname = this.mount.hostname;
            }

            if (this.mount.port) {
                port = `:${this.mount.port}`;
            }

            if (port === ':80' || port === ':443') {
                port = '';
            }

            protocol = protocol.split(':')[0];

            resolve(`${protocol}://${hostname}${port}`);
        });
    }
};

module.exports = PodiumContextMountOriginParser;

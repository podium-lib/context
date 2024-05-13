import { URL } from 'url';

/**
 * @typedef {object} PodiumContextMountOriginParserOptions
 * @property {string | null} [origin=null]
 */

export default class PodiumContextMountOriginParser {
    /**
     * @constructor
     * @param {PodiumContextMountOriginParserOptions} options
     */
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

        // @ts-expect-error because of Object.defineProperty
        if (this.defaultOrigin.hostname) {
            // @ts-expect-error because of Object.defineProperty
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
}

'use strict';

const _padFragment = Symbol('_padFragment');
const PROXY_PATHNAME = 'podium-resource';

const PodiumContextPublicPathnameParser = class PodiumContextPublicPathnameParser {
    constructor(mount = {}) {
        Object.defineProperty(this, 'mount', {
            value: mount,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextPublicPathnameParser';
    }

    [_padFragment](fragment) {
        if (!fragment.startsWith('/')) {
            fragment = `/${fragment}`;
        }

        if (!fragment.endsWith('/')) {
            fragment = `${fragment}/`;
        }

        return fragment;
    }

    parse(req) {
        return new Promise(resolve => {
            // This could be implemented simpler and better with the WHATWG URL module,
            // but its not done due to this memory leak fix not landed in node in the
            // time of writing: https://github.com/nodejs/node/issues/17448
            // trygve.lie@finn.no 2017.12.20
            let pathname = req.originalUrl ? req.originalUrl : '/';

            if (this.mount.pathname) {
                pathname = this.mount.pathname;
            }

            pathname = this[_padFragment](pathname);

            const resolver = (name = '/') => {
                name = this[_padFragment](name);
                return `${pathname}${PROXY_PATHNAME}${name}`;
            };

            resolve(resolver);
        });
    }
};

module.exports = PodiumContextPublicPathnameParser;

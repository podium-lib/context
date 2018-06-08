'use strict';

const _padFragment = Symbol('_padFragment');
const PROXY_PATHNAME = 'podium-resource';

const PodiumContextPublicPathnameParser = class PodiumContextPublicPathnameParser {
    constructor(publicPathname) {
        Object.defineProperty(this, 'mount', {
            value: publicPathname,
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
            let pathname = req.baseUrl ? req.baseUrl : '/';

            if (this.mount) {
                pathname = this.mount;
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

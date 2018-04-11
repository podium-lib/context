'use strict';

const _padFragment = Symbol('_padFragment');

const PodiumContextMountPathnameParser = class PodiumContextMountPathnameParser {
    constructor(mountPathname = null) {
        Object.defineProperty(this, 'mount', {
            value: mountPathname,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountPathnameParser';
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
            let pathname = req.originalUrl ? req.originalUrl : '/';

            if (this.mount) {
                pathname = this.mount;
            }

            pathname = this[_padFragment](pathname);

            resolve(pathname);
        });
    }
};

module.exports = PodiumContextMountPathnameParser;

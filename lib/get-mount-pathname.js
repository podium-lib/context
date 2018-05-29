'use strict';

const { URL } = require('url');

const PodiumContextMountPathnameParser = class PodiumContextMountPathnameParser {
    constructor(mountPathname = null) {
        Object.defineProperty(this, 'mount', {
            value: mountPathname,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountPathnameParser';
    }

    parse(req) {
        return new Promise(resolve => {
            let pathname = req.originalUrl ? req.originalUrl : '/';

            if (this.mount) {
                pathname = this.mount;
            }

            // NB: "http://localhost" is here added to be able to use URL, its not used
            const url = new URL(pathname, 'http://localhost');
            resolve(url.pathname);
        });
    }
};

module.exports = PodiumContextMountPathnameParser;

'use strict';

const ContextMountPathnameParser = class ContextMountPathnameParser {
    constructor(mount = {}) {
        Object.defineProperty(this, 'mount', {
            value: mount,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextMountPathnameParser';
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

            if (!pathname.startsWith('/')) {
                pathname = `/${pathname}`;
            }

            if (!pathname.endsWith('/')) {
                pathname = `${pathname}/`;
            }

            resolve(pathname);
        });
    }
};

module.exports = ContextMountPathnameParser;

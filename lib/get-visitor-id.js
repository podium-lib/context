'use strict';

module.exports = class ContextVisitorIdParser {
    constructor() {}

    get [Symbol.toStringTag]() {
        return 'ContextVisitorIdParser';
    }

    parse(req) {
        return new Promise(resolve => {
            if (!req.cookies) {
                resolve();
            }

            resolve(req.cookies.USERID);
        });
    }
};

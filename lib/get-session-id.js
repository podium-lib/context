'use strict';

module.exports = class ContextSessionIdParser {
    constructor() {

    }

    get [Symbol.toStringTag]() {
        return 'ContextSessionIdParser';
    }

    parse(req) {
        return new Promise(resolve => {
            const id =
                req.sessionId ||
                req.sessionID ||
                (req.cookies && req.cookies.finnSessionId);
            resolve(id);
        });
    }
};

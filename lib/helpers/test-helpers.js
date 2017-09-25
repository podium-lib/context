'use strict';

const Context = require('../context');
const ContextMiddleware = require('../middleware');
const config = require('../../config');

function getHeaders() {
    return {
        host: 'localhost:3030',
        'user-agent':
            'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36',
        accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        cookie:
            '__flt_dev=token-string; finnSessionId=session-id-string; podium-bucket=%7B%7DM; USERID=123',
        'trace-id': 'trace-uuid',
        'accept-encoding': 'gzip, deflate, sdch, br',
        'accept-language':
            'nb-NO,nb;q=0.8,no;q=0.6,nn;q=0.4,en-US;q=0.2,en;q=0.2,da;q=0.2,sv;q=0.2',
    };
}

function resolveToken() {
    return new Promise(r => setImmediate(r, { token: 'new-token' }));
}

function setup() {
    const middleware = new ContextMiddleware(config);
    const context = new Context(config);
    context.registerResolver({
        key: 'userToken',
        fn: resolveToken,
        keys: ['token'],
    });
    return { middleware, context };
}

function runMiddlewares(middleware, req, res) {
    return middleware.reduce(
        (p, fn) => p.then(() => new Promise(resolve => fn(req, res, resolve))),
        Promise.resolve()
    );
}

module.exports = {
    getHeaders,
    resolveToken,
    setup,
    runMiddlewares,
};

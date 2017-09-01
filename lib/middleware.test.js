'use strict';

const { test } = require('ava');
const ContextMiddleware = require('./middleware');

test.cb('should run middlewares if missing', t => {
    const req = {
        headers: {
            cookie: 'a=b; c=d; __flt_dev=flt-dev-token;',
            'user-agent': 'some user agent',
        },
        url: 'http://www.finn.no/some/url?and=param&andOlso=stuff',
    };
    const middleware = new ContextMiddleware();
    middleware.router()(req, null, () => {
        const { userToken, cookies, deviceType, query } = req;
        t.deepEqual(cookies, {
            a: 'b',
            c: 'd',
            '__flt_dev': 'flt-dev-token', // eslint-disable-line
        });
        t.deepEqual(query, {
            and: 'param',
            andOlso: 'stuff',
        });
        t.true(userToken === 'flt-dev-token');
        t.true(deviceType === 'desktop');
        t.end();
    });
});

test.cb('should not run middlewares if already runned', t => {
    const cookies = Symbol();
    const userToken = Symbol();
    const deviceType = Symbol();
    const query = Symbol();
    const req = {
        headers: {
            cookie: 'a=b; c=d; __flt_dev=flt-dev-token;',
            'user-agent': 'some user agent',
        },
        cookies,
        userToken,
        deviceType,
        query,
    };
    const middleware = new ContextMiddleware();
    middleware.router()(req, null, () => {
        t.true(req.cookies === cookies);
        t.true(req.userToken === userToken);
        t.true(req.deviceType === deviceType);
        t.true(req.query === query);
        t.end();
    });
});

'use strict';

const { test } = require('ava');
const { setup, runMiddlewares } = require('./helpers/test-helpers');

test('should run middlewares if missing', async t => {
    const req = {
        headers: {
            cookie: 'a=b; c=d; __flt_dev=flt-dev-token;',
            'user-agent': 'some user agent',
        },
        url: 'http://www.finn.no/some/url?and=param&andOlso=stuff',
    };
    const { middleware } = setup();
    await runMiddlewares(middleware.middleware(), req, null);
    const { userToken, token, cookies, deviceType, query } = req;
    t.deepEqual(cookies, {
        a: 'b',
        c: 'd',
            __flt_dev: 'flt-dev-token', // eslint-disable-line
    });
    t.deepEqual(query, { and: 'param', andOlso: 'stuff' });
    t.true(userToken === 'flt-dev-token');
    t.true(token === 'jwt:flt-dev-token');
    t.true(deviceType === 'desktop');
});

test('should not run middlewares if already runned', async t => {
    const cookies = Symbol();
    const userToken = Symbol();
    const token = Symbol();
    const deviceType = Symbol();
    const query = Symbol();
    const req = {
        headers: {
            cookie: 'a=b; c=d; __flt_dev=flt-dev-token;',
            'user-agent': 'some user agent',
        },
        cookies,
        userToken,
        token,
        deviceType,
        query,
    };
    const { middleware } = setup();
    await runMiddlewares(middleware.middleware(), req, null);

    t.true(req.cookies === cookies);
    t.true(req.userToken === userToken);
    t.true(req.deviceType === deviceType);
    t.true(req.query === query);
});

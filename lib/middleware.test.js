'use strict';

const { setup, runMiddlewares } = require('./helpers/test-helpers');

test('should run middlewares if missing', async () => {
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
    expect(cookies).toEqual({
        a: 'b',
        c: 'd',
        __flt_dev: 'flt-dev-token', // eslint-disable-line
    });
    expect(query).toEqual({ and: 'param', andOlso: 'stuff' });
    expect(userToken).toBe('flt-dev-token');
    expect(token).toBe('jwt:flt-dev-token');
    expect(deviceType).toBe('desktop');
});

test('should not run middlewares if already runned', async () => {
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

    expect(req.cookies).toBe(cookies);
    expect(req.userToken).toBe(userToken);
    expect(req.deviceType).toBe(deviceType);
    expect(req.query).toBe(query);
});

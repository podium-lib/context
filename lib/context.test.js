'use strict';

const { test } = require('ava');
const Context = require('./context');

const { getHeaders, setup, runMiddlewares } = require('./helpers/test-helpers');

test('should not throw if valid options', t => {
    t.notThrows(() => {
        // eslint-disable-next-line no-new
        new Context({});
    });
});

test('processRequest', async t => {
    const { middleware, context } = setup();

    const headers = getHeaders();

    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
    };
    await runMiddlewares(middleware.middleware(), req, null);
    const result = await context.processRequest(req);

    const { userToken, cookies, deviceType } = req;

    t.truthy(cookies);
    t.truthy(deviceType);
    t.truthy(userToken);

    t.deepEqual(result, {
        domain: 'localhost',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        resourceMountPath: '/podium-resource',
        token: 'jwt:token-string',
        sessionId: 'session-id-string',
        userAgent: headers['user-agent'],
        query: {
            x: '1',
            a: '2',
            b: '3',
            c: '4',
        },
        deviceType: 'mobile',
        locale: 'nb-NO',
        traceId: 'trace-uuid',
        debug: false,
        requestedBy: 'podium-context-client',
        visitorId: '123',
    });
});

test('processRequest from minimal request', async t => {
    const { middleware, context } = setup();

    const headers = {
        host: 'localhost:3030',
        cookie: 'finnSessionId=session-id-string; __flt_dev=  ;  USERID=123',
    };
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path',
    };
    await runMiddlewares(middleware.middleware(), req, null);
    const result = await context.processRequest(req);

    const { cookies } = req;

    t.truthy(cookies);

    t.deepEqual(result, {
        domain: 'localhost',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        resourceMountPath: '/podium-resource',
        sessionId: 'session-id-string',
        query: {},
        deviceType: 'mobile',
        locale: 'nb-NO',
        debug: false,
        requestedBy: 'podium-context-client',
        visitorId: '123',
    });
});

test('processRequest with payload', async t => {
    const { middleware, context } = setup();
    const headers = getHeaders();
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    };
    await runMiddlewares(middleware.middleware(), req, null);
    const result = await context.processRequest(req);

    t.deepEqual(result, {
        domain: 'localhost',
        resourceMountPath: '/podium-resource',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        token: 'jwt:token-string',
        sessionId: 'session-id-string',
        userAgent: headers['user-agent'],
        query: {
            x: '1',
            a: '2',
            b: '3',
            c: '4',
        },
        deviceType: 'mobile',
        payload: 'asd',
        locale: 'nb-NO',
        traceId: 'trace-uuid',
        debug: false,
        requestedBy: 'podium-context-client',
        visitorId: '123',
    });
});

test('set token from resolveToken', async t => {
    const { middleware, context } = setup();
    const headers = getHeaders();
    const req = {
        headers,
        hostname: 'localhost',
    };
    await runMiddlewares(middleware.middleware(), req, null);
    const result = await context.processRequest(req);

    t.deepEqual(result.token, 'jwt:token-string');
});

test('query should use req.query if provided', async t => {
    const { middleware, context } = setup();
    const req = {
        hostname: 'localhost',
        query: { some: 'query' },
        headers: getHeaders(),
    };
    await runMiddlewares(middleware.middleware(), req, null);
    const result = await context.processRequest(req);
    t.true(result.query === req.query);
});

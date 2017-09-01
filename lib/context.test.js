'use strict';

const { test } = require('ava');
const Context = require('./context');

const { getHeaders, resolveToken, setup } = require('./helpers/test-helpers');

test('should not throw if valid options', t => {
    t.plan(0);

    // eslint-disable-next-line no-new
    new Context({
        resolveToken,
    });
});

test('processRequest', async t => {
    const { middleware, context } = setup();

    const headers = getHeaders();

    const provide = middleware.process({
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
    });
    const result = await context.processRequest(provide);

    const { userToken, cookies, deviceType } = provide;

    t.truthy(cookies);
    t.truthy(deviceType);
    t.truthy(userToken);

    t.deepEqual(result, {
        domain: 'localhost',
        baseUrl: '',
        cdnHost: '',
        resourceMountPath: '/podium-resource',
        userToken: 'token-string',
        token: 'new-token',
        sessionId: 'session-id-string',
        userId: 'user-id',
        spidId: 'spid-id',
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

test('processRequest with payload', async t => {
    const { middleware, context } = setup();
    const headers = getHeaders();
    const provide = middleware.process({
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    });
    const result = await context.processRequest(provide);

    t.deepEqual(result, {
        domain: 'localhost',
        resourceMountPath: '/podium-resource',
        baseUrl: '',
        cdnHost: '',
        userToken: 'token-string',
        token: 'new-token',
        sessionId: 'session-id-string',
        userId: 'user-id',
        spidId: 'spid-id',
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
    const provide = middleware.process({
        headers,
        hostname: 'localhost',
    });
    const result = await context.processRequest(provide);

    t.deepEqual(result.token, 'new-token');
    t.deepEqual(result.userId, 'user-id');
});

test('query should use req.query if provided', async t => {
    const { middleware, context } = setup();
    const provide = middleware.process({
        hostname: 'localhost',
        query: { some: 'query' },
        headers: getHeaders(),
    });
    const result = await context.processRequest(provide);
    t.true(result.query === provide.query);
});

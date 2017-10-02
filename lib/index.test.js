'use strict';

const { test } = require('ava');
const { runMiddlewares, getConfig } = require('./helpers/test-helpers');
const { internalMiddleware, browserMiddleware } = require('./index');

test('fromPodiumClientRequest', async t => {
    const middleware = internalMiddleware(getConfig());

    const provide = {
        hostname: 'host.com',
        query: { a: 'b' },
        headers: {
            'user-agent': 'some-ua',
            'podium-domain': 'finn.no',
            'podium-device-type': 'mobile',
            'podium-base-url': 'https://www.finn.no',
            'podium-resource-mount-path': '/podium-resource',
            'podium-user-agent': 'some-ua',
            'podium-token': 'some-jwt-token',
            'podium-session-id': 'some-session-id',
            'podium-locale': 'nb-NO',
            'podium-cdn-host': 'some.host.com/',
            'podium-extras': '{}',
            'podium-trace-id': 'some-trace-id',

            'podium-debug': 'true',
            'podium-known-versions': '1,2,3',
            'podium-requested-by': 'some-server-id',
        },
    };

    await runMiddlewares(middleware, provide, null);

    const result = provide.podiumContext;

    t.deepEqual(result, {
        domain: 'finn.no',
        deviceType: 'mobile',
        baseUrl: 'https://www.finn.no',
        userAgent: 'some-ua',
        token: 'some-jwt-token',
        sessionId: 'some-session-id',
        cdnHost: 'some.host.com/',
        traceId: 'some-trace-id',
        extras: {},
        query: {
            a: 'b',
        },
        locale: 'nb-NO',
        resourceMountPath: '/podium-resource',
        debug: true,
        knownVersions: '1,2,3',
        requestedBy: 'some-server-id',
    });
});

test('fromPodiumClientRequest 2', async t => {
    const middleware = internalMiddleware(getConfig());

    const provide = {
        hostname: 'host.com',
        query: { a: 'b' },
        headers: {
            'user-agent': 'some-ua',
            'podium-domain': 'finn.no',
            'podium-device-type': 'mobile',
            'podium-base-url': 'https://www.finn.no',
            'podium-resource-mount-path': '/podium-resource',
            'podium-user-agent': 'some-ua',
            'podium-locale': 'nb-NO',
            'podium-cdn-host': 'some.host.com/',
            'podium-extras': '{}',
            'podium-trace-id': 'some-trace-id',

            'podium-debug': 'true',
            'podium-known-versions': '1,2,3',
            'podium-requested-by': 'some-server-id',
        },
    };

    await runMiddlewares(middleware, provide, null);

    const result = provide.podiumContext;

    t.deepEqual(result, {
        domain: 'finn.no',
        deviceType: 'mobile',
        baseUrl: 'https://www.finn.no',
        userAgent: 'some-ua',
        cdnHost: 'some.host.com/',
        traceId: 'some-trace-id',
        extras: {},
        query: {
            a: 'b',
        },
        locale: 'nb-NO',
        resourceMountPath: '/podium-resource',
        debug: true,
        knownVersions: '1,2,3',
        requestedBy: 'some-server-id',
    });
});

test('minimal request should not throw', async t => {
    const middleware = browserMiddleware(getConfig());

    const provide = {
        hostname: 'finn.no',
        query: {},
        headers: {},
    };

    await runMiddlewares(middleware, provide, null);

    const result = provide.podiumContext;

    t.deepEqual(result, {
        domain: 'finn.no',
        deviceType: 'mobile',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        query: {},
        locale: 'nb-NO',
        resourceMountPath: '/podium-resource',
        debug: false,
        requestedBy: 'podium-context-client',
    });
});

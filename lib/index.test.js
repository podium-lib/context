'use strict';

const { test } = require('ava');
const { runMiddlewares, resolveToken } = require('./helpers/test-helpers');
const { internalMiddleware } = require('./index');

test('fromPodiumClientRequest', async t => {
    const middleware = internalMiddleware({ resolveToken });

    const provide = {
        hostname: 'host.com',
        headers: {
            'user-agent': 'some-ua',
            'podium-domain': 'finn.no',
            'podium-device-type': 'mobile',
            'podium-base-url': 'https://www.finn.no',
            'podium-resource-mount-path': '/podium-resource/',
            'podium-user-agent': 'some-ua',
            'podium-user-token': 'some-token',
            'podium-token': 'some-jwt-token',
            'podium-user-id': 'some-user-id',
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
        userToken: 'some-token',
        token: 'some-jwt-token',
        userId: 'some-user-id',
        sessionId: 'some-session-id',
        cdnHost: 'some.host.com/',
        traceId: 'some-trace-id',
        extras: {},
        query: {},
        locale: 'nb-NO',
        resourceMountPath: '/podium-resource/',
        debug: true,
        knownVersions: '1,2,3',
        requestedBy: 'some-server-id',
    });
});

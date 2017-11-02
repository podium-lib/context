'use strict';

const { getConfig } = require('./helpers/test-helpers');
const { internalMiddleware, browserMiddleware } = require('./index');

const express = require('express');
const request = require('supertest');

const userAgent =
    'Mozilla/5.0 (iPhone; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.25 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';

const userAgentDesktop =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
const userAgentTablet =
    'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10';

const baseExpect = {
    domain: 'finn.no',
    deviceType: 'mobile',
    baseUrl: '',
    cdnHost: 'https://static.finncdn.no',
    query: {},
    locale: 'nb-NO',
    resourceMountPath: '/podium-resource',
    debug: false,
    requestedBy: 'podium-context-client',
};

test('fromPodiumClientRequest', async () => {
    const app = express();
    app.use(internalMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .query({ a: 'b' })
        .set({
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
            'podium-trace-id': 'some-trace-id',

            'podium-debug': 'true',
            'podium-known-versions': '1,2,3',
            'podium-requested-by': 'some-server-id',
        })
        .expect(200);

    expect(response.body).toEqual({
        domain: 'finn.no',
        deviceType: 'mobile',
        baseUrl: 'https://www.finn.no',
        userAgent: 'some-ua',
        token: 'some-jwt-token',
        sessionId: 'some-session-id',
        cdnHost: 'some.host.com/',
        traceId: 'some-trace-id',
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

test('fromPodiumClientRequest 2', async () => {
    const app = express();
    app.use(internalMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .query({ a: 'b' })
        .set({
            'user-agent': 'some-ua',
            'podium-domain': 'finn.no',
            'podium-device-type': 'mobile',
            'podium-base-url': 'https://www.finn.no',
            'podium-resource-mount-path': '/podium-resource',
            'podium-user-agent': 'some-ua',
            'podium-locale': 'nb-NO',
            'podium-cdn-host': 'some.host.com/',
            'podium-trace-id': 'some-trace-id',

            'podium-debug': 'true',
            'podium-known-versions': '1,2,3',
            'podium-requested-by': 'some-server-id',
        })
        .expect(200);

    expect(response.body).toEqual({
        domain: 'finn.no',
        deviceType: 'mobile',
        baseUrl: 'https://www.finn.no',
        userAgent: 'some-ua',
        cdnHost: 'some.host.com/',
        traceId: 'some-trace-id',
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

test('minimal request should not throw', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .set('host', 'finn.no')
        .set('User-agent', userAgent)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        userAgent,
    });
});

test('broken locale request should return error', async () => {
    const app = express();
    app.use((req, res, next) => {
        req.locale = 'f';
        next();
    });
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    await request(app)
        .get('/')
        .expect(500);
});

test('with userToken', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const userToken = `some-flt-token-${Math.round(Math.random() * 1000)}`;
    const response = await request(app)
        .get('/')
        .set('host', 'finn.no')
        .set('User-agent', userAgent)
        .set('cookie', `__flt_dev=${userToken}`)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        userAgent,
        token: `jwt:${userToken}`,
    });
});

test('with cookies', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const visitorId = `USERID-${Math.round(Math.random() * 1000)}`;
    const sessionId = `SESSION-${Math.round(Math.random() * 1000)}`;
    const response = await request(app)
        .get('/')
        .set('host', 'schibsted.com')
        .set('User-agent', userAgent)
        .set('cookie', `USERID=${visitorId};finnSessionId=${sessionId}`)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        domain: 'schibsted.com',
        userAgent,
        visitorId,
        sessionId,
    });
});
test('devicesTypes desktop', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .set('host', 'schibsted.com')
        .set('User-agent', userAgentDesktop)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        domain: 'schibsted.com',
        deviceType: 'desktop',
        userAgent: userAgentDesktop,
    });
});

test('devicesTypes tablet', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .set('host', 'schibsted.com')
        .set('User-agent', userAgentTablet)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        domain: 'schibsted.com',
        deviceType: 'tablet',
        userAgent: userAgentTablet,
    });
});

test('query from req', async () => {
    const app = express();
    app.use((req, res, next) => {
        req.query = { c: 'd' };
        next();
    });
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .set('host', 'finn.no')
        .set('User-agent', userAgent)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        query: { c: 'd' },
        userAgent,
    });
});

test('parse query', async () => {
    const app = express();
    app.use(browserMiddleware(getConfig()));
    app.get('/', (req, res) => res.json(req.podiumContext));

    const response = await request(app)
        .get('/')
        .query({ x: 'y' })
        .set('host', 'finn.no')
        .set('User-agent', userAgent)
        .expect(200);

    expect(response.body).toEqual({
        ...baseExpect,
        query: { x: 'y' },
        userAgent,
    });
});

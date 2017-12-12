'use strict';

const Context = require('../lib/context');
const helpers = require('../helpers/test-helpers');

/**
 * Constructor
 */

test('Context() - instantiate new context object - should create an object', () => {
    const context = new Context('foo');
    expect(context).toBeInstanceOf(Context);
});

test('Context() - object tag - should be ContextResolver', () => {
    const context = new Context('foo');
    expect(Object.prototype.toString.call(context)).toEqual(
        '[object ContextResolver]'
    );
});

test('Context() - no value given to "requestedBy" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const context = new Context();
    }).toThrowError('You must provide a value to "requestedBy".');
});

test('.deserialize() - request has podium header - should put headers into res.locals', () => {
    const req = {
        headers: {
            'bar': 'foo',
            'podium-foo': 'bar podium'
        }
    };

    const res = {};

    const middleware = Context.deserialize();
    middleware(req, res, () => {});

    expect(res.podium.context.foo).toEqual('bar podium');
});

test('processRequest', () => {
    const headers = helpers.getHeaders();
    const context = new Context('foo');

    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        cookies: { USERID: '123' },
    };

    const res = {};

    const middleware = context.serialize();
    middleware(req, res, () => {
        expect(res.podium.context).toEqual({
            'podium-domain': 'localhost',
            'podium-resource-mount-path': '/podium-resource',
            'podium-device-type': 'mobile',
            'podium-locale': 'en-EN',
            'podium-debug': 'false',
            'podium-requested-by': 'foo',
            'podium-visitor-id': '123',
        });
    });
});

test('processRequest from minimal request', async () => {
    const context = new Context('foo');

    const headers = {
        host: 'localhost:3030',
    };
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path',
    };

    const res = {};

    const middleware = context.serialize();
    middleware(req, res, () => {
        expect(res.podium.context).toEqual({
            'podium-domain': 'localhost',
            'podium-resource-mount-path': '/podium-resource',
            'podium-device-type': 'desktop',
            'podium-locale': 'en-EN',
            'podium-debug': 'false',
            'podium-requested-by': 'foo',
            'podium-visitor-id': undefined,
        });
    });
});
/*
test('processRequest with payload', async () => {
    const context = new Context(getConfig());
    const headers = getHeaders();
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
        cookies: { USERID: '123' },
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);

    expect(result).toEqual({
        domain: 'localhost',
        resourceMountPath: '/podium-resource',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
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

test('query should use req.query if provided', async () => {
    const context = new Context(getConfig());
    const req = {
        hostname: 'localhost',
        query: { some: 'query' },
        headers: getHeaders(),
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);
    expect(result.query).toBe(req.query);
});

test('should export locale', async () => {
    const context = new Context(getConfig());
    const req = {
        hostname: 'localhost',
        query: { some: 'query' },
        headers: getHeaders(),
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);
    expect(result.locale).toBe('nb-NO');
});

test('should pick up locale', async () => {
    const context = new Context(getConfig());
    const req = {
        hostname: 'localhost',
        query: { some: 'query' },
        headers: getHeaders(),
        locale: 'en-GB',
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);
    expect(result.locale).toBe('en-GB');
});
*/

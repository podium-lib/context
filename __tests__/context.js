'use strict';

const Context = require('../lib/context');
const helpers = require('../lib/helpers/test-helpers');

/**
 * Constructor
 */

test('Context() - instantiate new context object - should create an object', () => {
    const context = new Context();
    expect(context).toBeInstanceOf(Context);
});

test('Context() - object tag - should be ContextResolver', () => {
    const context = new Context();
    expect(Object.prototype.toString.call(context)).toEqual(
        '[object ContextResolver]'
    );
});

test('.deserialize() - request has podium header - should put headers into res.locals', () => {
    const req = {
        headers: {
            'bar': 'foo',
            'podium-foo': 'bar podium'
        }
    };

    const res = {
        locals: {}
    };

    const middleware = Context.deserialize();
    middleware(req, res, () => {});

    expect(res.locals.podium.context.foo).toEqual('bar podium');
});

test('processRequest', () => {
    const headers = helpers.getHeaders();
    const context = new Context();

    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        cookies: { USERID: '123' },
    };

    const res = {
        locals: {}
    };

    const middleware = context.serialize();
    middleware(req, res, () => {
        expect(res.locals.podium.context).toEqual({
            'podium-domain': 'localhost',
//            'podium-baseUrl': '',
//            'podium-cdnHost': 'https://static.finncdn.no',
//            'podium-resourceMountPath': '/podium-resource',
//            'podium-userAgent': headers['user-agent'],
            'podium-device-type': 'mobile',
            'podium-locale': 'nb-NO',
            'podium-trace-id': 'trace-uuid',
            'podium-debug': 'false',
            'podium-requested-by': 'podium-context-client',
            'podium-visitor-id': '123',
            'podium-session-id': undefined,
        });
    });
});

test('processRequest from minimal request', async () => {
    const context = new Context();

    const headers = {
        host: 'localhost:3030',
    };
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path',
    };

    const res = {
        locals: {}
    };

    const middleware = context.serialize();
    middleware(req, res, () => {
        expect(res.locals.podium.context).toEqual({
            'podium-domain': 'localhost',
//            'podium-baseUrl': '',
//            'podium-cdnHost': 'https://static.finncdn.no',
//            'podium-resourceMountPath': '/podium-resource',
//            'podium-userAgent': headers['user-agent'],
            'podium-device-type': 'desktop',
            'podium-locale': 'nb-NO',
            'podium-trace-id': undefined,
            'podium-debug': 'false',
            'podium-requested-by': 'podium-context-client',
            'podium-visitor-id': undefined,
            'podium-session-id': undefined,
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

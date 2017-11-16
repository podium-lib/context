'use strict';

const Context = require('../lib/context');

/*
const middleware = require('./middleware');
const { getHeaders, getConfig } = require('./helpers/test-helpers');
*/

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

/*


test('should not throw if valid options', () => {
    expect(() => {
        // eslint-disable-next-line no-new
        new Context({});
    }).not.toThrowError();
});

test('processRequest', async () => {
    const context = new Context(getConfig());

    const headers = getHeaders();

    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        cookies: { USERID: '123' },
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);

    expect(result).toEqual({
        domain: 'localhost',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        resourceMountPath: '/podium-resource',
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

test('processRequest from minimal request', async () => {
    const context = new Context(getConfig());

    const headers = {
        host: 'localhost:3030',
    };
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path',
    };
    middleware(req, null, () => {});
    const result = await context.processRequest(req);

    expect(result).toEqual({
        domain: 'localhost',
        baseUrl: '',
        cdnHost: 'https://static.finncdn.no',
        resourceMountPath: '/podium-resource',
        query: {},
        deviceType: 'mobile',
        locale: 'nb-NO',
        debug: false,
        requestedBy: 'podium-context-client',
    });
});

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

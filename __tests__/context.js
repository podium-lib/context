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

/**
 * .register()
 */

test('Context.register() - no value given to "name" argument - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register();
    }).toThrowError('You must provide a value to "name".');
});

test('Context.register() - no value given to "parser" argument - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar');
    }).toThrowError('You must provide a value to "parser".');
});

test('Context.register() - same "name" value given twice - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    const dummy = {
        parse: () => {}
    };
    expect(() => {
        context.register('bar', dummy);
        context.register('bar', dummy);
    }).toThrowError('Parser with the name "bar" has already been registered.');
});

test('Context.register() - object passed to "parser" argument has no parse key - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar', {});
    }).toThrowError('Parser with the name "bar" is missing a ".parse()" method.');
});

test('Context.register() - object passed to "parser" argument has no parse() method - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar', {
            parse: 'foo'
        });
    }).toThrowError('Parse method at parser with the name "bar" is not a function.');
});

/**
 * .deserialize()
 */

test('Context.middleware() - request has podium header - should put headers into res.locals', () => {
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

/**
 * .serialize()
 */

test('Context.middleware() - process a "rich" request - should put parsed values into res.podium.context', () => {
    const context = new Context('foo');

    const req = {
        headers: helpers.getHeaders(),
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        cookies: { USERID: '123' },
    };

    const res = {};

    const middleware = context.middleware();
    middleware(req, res, () => {
        expect(res.podium.context).toEqual({
            'podium-mount-origin': 'http://localhost:3030',
            'podium-resource-mount-path': '/podium-resource',
            'podium-device-type': 'mobile',
            'podium-locale': 'en-EN',
            'podium-debug': 'false',
            'podium-requested-by': 'foo',
            'podium-visitor-id': '123',
        });
    });
});

test('Context.middleware() - process a "minimal" request - should put parsed values into res.podium.context', () => {
    const context = new Context('foo');

    const req = {
        headers: {
            host: 'localhost:3030',
        },
        hostname: 'localhost',
        url: '/some/path',
    };

    const res = {};

    const middleware = context.middleware();
    middleware(req, res, () => {
        expect(res.podium.context).toEqual({
            'podium-mount-origin': 'http://localhost:3030',
            'podium-resource-mount-path': '/podium-resource',
            'podium-device-type': 'desktop',
            'podium-locale': 'en-EN',
            'podium-debug': 'false',
            'podium-requested-by': 'foo',
            'podium-visitor-id': undefined,
        });
    });
});


test('Context.middleware() - a parser throws - should emit "next()" with Boom Error Object', () => {
    expect.assertions(2);

    const context = new Context('foo');
    context.register('fooBar', {
        parse: () => {
            return new Promise((resolve, reject) => {
                reject(new Error('bogus'));
            });
        }
    });

    const headers = {
        host: 'localhost:3030',
    };
    const req = {
        headers,
        hostname: 'localhost',
        url: '/some/path',
    };

    const res = {};

    const middleware = context.middleware();
    middleware(req, res, (error) => {
        expect(error.message).toEqual('Error during context parsing or serializing: bogus');
        expect(error.isBoom).toBeTruthy();
    });
});

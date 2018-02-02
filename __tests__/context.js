'use strict';

const Context = require('../lib/context');

const HEADER_RICH = {
    host: 'localhost:3030',
    'user-agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36',
    accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    cookie:
        '__flt_dev=token-string; finnSessionId=session-id-string; podium-bucket=%7B%7DM; USERID=123',
    'trace-id': 'trace-uuid',
    'accept-encoding': 'gzip, deflate, sdch, br',
    'accept-language':
        'nb-NO,nb;q=0.8,no;q=0.6,nn;q=0.4,en-US;q=0.2,en;q=0.2,da;q=0.2,sv;q=0.2',
};

/**
 * Constructor
 */

test('PodiumContext() - instantiate new context object - should create an object', () => {
    const context = new Context('foo');
    expect(context).toBeInstanceOf(Context);
});

test('PodiumContext() - object tag - should be PodiumContext', () => {
    const context = new Context('foo');
    expect(Object.prototype.toString.call(context)).toEqual(
        '[object PodiumContext]'
    );
});

test('PodiumContext() - no value given to "name" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const context = new Context(); // eslint-disable-line no-unused-vars
    }).toThrowError('You must provide a value to "name".');
});

/**
 * .register()
 */

test('PodiumContext.register() - no value given to "name" argument - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register();
    }).toThrowError('You must provide a value to "name".');
});

test('PodiumContext.register() - no value given to "parser" argument - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar');
    }).toThrowError('You must provide a value to "parser".');
});

test('PodiumContext.register() - same "name" value given twice - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    const dummy = {
        parse: () => {},
    };
    expect(() => {
        context.register('bar', dummy);
        context.register('bar', dummy);
    }).toThrowError('Parser with the name "bar" has already been registered.');
});

test('PodiumContext.register() - object passed to "parser" argument has no parse key - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar', {});
    }).toThrowError(
        'Parser with the name "bar" is missing a ".parse()" method.'
    );
});

test('PodiumContext.register() - object passed to "parser" argument has no parse() method - should throw', () => {
    expect.hasAssertions();
    const context = new Context('foo');
    expect(() => {
        context.register('bar', {
            parse: 'foo',
        });
    }).toThrowError(
        'Parse method at parser with the name "bar" is not a function.'
    );
});

/**
 * .serialize()
 */

test('PodiumContext.serialize() - no arguments given - should return empty object', () => {
    const result = Context.serialize();
    expect(result).toEqual({});
});

test('PodiumContext.serialize() - headers and context is given - should copy context into headers', () => {
    const context = {
        'podium-foo': 'bar',
        'podium-bar': 'foo',
    };

    const headers = {
        test: 'xyz',
    };

    const result = Context.serialize(headers, context);
    expect(result).toEqual({
        'podium-foo': 'bar',
        'podium-bar': 'foo',
        test: 'xyz',
    });
});

test('PodiumContext.serialize() - one key on the context is a function - should call the function and set value on headers', () => {
    const context = {
        'podium-foo': 'bar',
        'podium-bar': name => `${name}-test`,
    };

    const headers = {
        test: 'xyz',
    };

    const result = Context.serialize(headers, context, 'foo');
    expect(result).toEqual({
        'podium-foo': 'bar',
        'podium-bar': 'foo-test',
        test: 'xyz',
    });
});

/**
 * .deserialize()
 */

test('PodiumContext.deserialize() - request has podium header - should put headers into res.locals', () => {
    const req = {
        headers: {
            bar: 'foo',
            'podium-foo': 'bar podium',
        },
    };

    const res = {};

    const middleware = Context.deserialize();
    middleware(req, res, () => {});

    expect(res.podium.context.foo).toEqual('bar podium');
});

/**
 * .middleware()
 */

test('PodiumContext.middleware() - process a "rich" request - should put parsed values into res.podium.context', () => {
    const context = new Context('foo');

    const req = {
        headers: HEADER_RICH,
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        cookies: { USERID: '123' },
    };

    const res = {};

    const middleware = context.middleware();
    middleware(req, res, () => {
        const ctx = res.podium.context;
        expect(ctx['podium-mount-origin']).toEqual('http://localhost:3030');
        expect(ctx['podium-mount-pathname']).toEqual('/');
        expect(ctx['podium-device-type']).toEqual('mobile');
        expect(ctx['podium-locale']).toEqual('en-EN');
        expect(ctx['podium-debug']).toEqual('false');
        expect(ctx['podium-requested-by']).toEqual('foo');
        expect(ctx['podium-visitor-id']).toEqual('123');
        expect(ctx['podium-public-pathname']).toBeInstanceOf(Function);
    });
});

test('PodiumContext.middleware() - process a "minimal" request - should put parsed values into res.podium.context', () => {
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
        const ctx = res.podium.context;
        expect(ctx['podium-mount-origin']).toEqual('http://localhost:3030');
        expect(ctx['podium-mount-pathname']).toEqual('/');
        expect(ctx['podium-device-type']).toEqual('desktop');
        expect(ctx['podium-locale']).toEqual('en-EN');
        expect(ctx['podium-debug']).toEqual('false');
        expect(ctx['podium-requested-by']).toEqual('foo');
        expect(ctx['podium-visitor-id']).toEqual(undefined);
        expect(ctx['podium-public-pathname']).toBeInstanceOf(Function);
    });
});

test('PodiumContext.middleware() - a parser throws - should emit "next()" with Boom Error Object', () => {
    expect.assertions(2);

    const context = new Context('foo');
    context.register('fooBar', {
        parse: () =>
            new Promise((resolve, reject) => {
                reject(new Error('bogus'));
            }),
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
    middleware(req, res, error => {
        expect(error.message).toEqual(
            'Error during context parsing or serializing: bogus'
        );
        expect(error.isBoom).toBeTruthy();
    });
});

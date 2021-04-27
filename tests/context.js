'use strict';

const tap = require('tap');
const { HttpIncoming } = require('@podium/utils');
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

//
// Constructor
//

tap.test(
    'PodiumContext() - instantiate new context object - should create an object',
    (t) => {
        const context = new Context({ name: 'foo' });
        t.true(context instanceof Context);
        t.end();
    },
);

tap.test('PodiumContext() - object tag - should be PodiumContext', (t) => {
    const context = new Context({ name: 'foo' });
    t.equal(Object.prototype.toString.call(context), '[object PodiumContext]');
    t.end();
});

tap.test('PodiumContext() - no value given to "name"', (t) => {
    t.plan(1);
    t.throws(
        () => {
            const context = new Context(); // eslint-disable-line no-unused-vars
        },
        /The value, "undefined", for the required argument "name" on the Context constructor is not defined or not valid./,
        'Should throw',
    );
    t.end();
});

//
// .register()
//

tap.test(
    'PodiumContext.register() - no value given to "name" argument',
    (t) => {
        t.plan(1);
        const context = new Context({ name: 'foo' });
        t.throws(
            () => {
                context.register();
            },
            /You must provide a value to "name"./,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContext.register() - no value given to "parser" argument',
    (t) => {
        t.plan(1);
        const context = new Context({ name: 'foo' });
        t.throws(
            () => {
                context.register('bar');
            },
            /You must provide a value to "parser"./,
            'Should throw',
        );
        t.end();
    },
);

tap.test('PodiumContext.register() - same "name" value given twice', (t) => {
    t.plan(1);
    const context = new Context({ name: 'foo' });
    const dummy = {
        parse: () => {},
    };
    t.throws(
        () => {
            context.register('bar', dummy);
            context.register('bar', dummy);
        },
        /Parser with the name "bar" has already been registered./,
        'Should throw',
    );
    t.end();
});

tap.test(
    'PodiumContext.register() - object passed to "parser" argument has no parse key',
    (t) => {
        t.plan(1);
        const context = new Context({ name: 'foo' });
        t.throws(
            () => {
                context.register('bar', {});
            },
            /Parser with the name "bar" is missing a ".parse/,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContext.register() - object passed to "parser" argument has no parse() method',
    (t) => {
        t.plan(1);
        const context = new Context({ name: 'foo' });
        t.throws(
            () => {
                context.register('bar', {
                    parse: 'foo',
                });
            },
            /Parse method for parser "bar" must be a function or async function./,
            'Should throw',
        );
        t.end();
    },
);

//
// .serialize()
//

tap.test(
    'PodiumContext.serialize() - no arguments given - should return empty object',
    (t) => {
        const result = Context.serialize();
        t.same(result, {});
        t.end();
    },
);

tap.test(
    'PodiumContext.serialize() - headers and context is given - should copy context into headers',
    (t) => {
        const context = {
            'podium-foo': 'bar',
            'podium-bar': 'foo',
        };

        const headers = {
            test: 'xyz',
        };

        const result = Context.serialize(headers, context);
        t.same(result, {
            'podium-foo': 'bar',
            'podium-bar': 'foo',
            test: 'xyz',
        });
        t.end();
    },
);

tap.test(
    'PodiumContext.serialize() - one key on the context is a function - should call the function and set value on headers',
    (t) => {
        const context = {
            'podium-foo': 'bar',
            'podium-bar': (name) => `${name}-test`,
        };

        const headers = {
            test: 'xyz',
        };

        const result = Context.serialize(headers, context, 'foo');
        t.same(result, {
            'podium-foo': 'bar',
            'podium-bar': 'foo-test',
            test: 'xyz',
        });
        t.end();
    },
);

//
// .deserialize()
//

tap.test(
    'PodiumContext.deserialize() - request has podium header - should put headers into res.locals.podium',
    (t) => {
        const req = {
            headers: {
                bar: 'foo',
                'podium-foo': 'bar podium',
            },
        };

        const res = {};

        const middleware = Context.deserialize();
        middleware(req, res, () => {
            t.equal(res.locals.podium.context.foo, 'bar podium');
            t.end();
        });
    },
);

//
// .process()
//

tap.test(
    'PodiumContext.middleware() - process a "rich" request - should put parsed values into res.locals.podium',
    async (t) => {
        const context = new Context({ name: 'foo' });
        const incoming = new HttpIncoming({
            headers: HEADER_RICH,
            hostname: 'localhost',
            url: '/some/path?x=1&a=2&b=3&c=4',
            cookies: { USERID: '123' },
        });

        const result = await context.process(incoming);
        t.equal(result.context['podium-mount-origin'], 'http://localhost:3030');
        t.equal(result.context['podium-mount-pathname'], '/');
        t.equal(result.context['podium-device-type'], 'mobile');
        t.equal(result.context['podium-locale'], 'en-US');
        t.equal(result.context['podium-debug'], 'false');
        t.equal(result.context['podium-requested-by'], 'foo');
        t.type(result.context['podium-public-pathname'], 'function');
    },
);

tap.test(
    'PodiumContext.middleware() - process a "minimal" request - should put parsed values into res.locals.podium',
    async (t) => {
        const context = new Context({ name: 'foo' });
        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
            },
            hostname: 'localhost',
            url: '/some/path',
        });

        const result = await context.process(incoming);
        t.equal(result.context['podium-mount-origin'], 'http://localhost:3030');
        t.equal(result.context['podium-mount-pathname'], '/');
        t.equal(result.context['podium-device-type'], 'desktop');
        t.equal(result.context['podium-locale'], 'en-US');
        t.equal(result.context['podium-debug'], 'false');
        t.equal(result.context['podium-requested-by'], 'foo');
        t.type(result.context['podium-public-pathname'], 'function');
    },
);

tap.test(
    'PodiumContext.middleware() - a parser throws - should emit "next()" with Boom Error Object',
    async (t) => {
        const context = new Context({ name: 'foo' });

        context.register('fooBar', {
            parse: () =>
                new Promise((resolve, reject) => {
                    reject(new Error('bogus'));
                }),
        });

        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
            },
            hostname: 'localhost',
            url: '/some/path',
        });

        try {
            await context.process(incoming);
        } catch (error) {
            t.equal(error.message, 'bogus');
        }
    },
);

tap.test(
    'PodiumContext.middleware() - timing success metric produced',
    async (t) => {
        const context = new Context({ name: 'foo' });

        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
            },
            hostname: 'localhost',
            url: '/some/path',
        });
        incoming.name = 'mylayout';

        const metrics = [];
        context.metrics.on('data', (metric) => {
            metrics.push(metric);
        });

        await context.process(incoming);

        t.equal(metrics.length, 1);
        t.type(metrics[0].timestamp, 'number');
        t.equal(metrics[0].type, 5);
        t.equal(metrics[0].name, 'podium_context_process');
        t.same(metrics[0].labels, [{ name: 'name', value: 'mylayout' }]);
        t.same(metrics[0].meta, { buckets: [0.001, 0.01, 0.1, 0.5, 1] });
    },
);

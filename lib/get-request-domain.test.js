'use strict';

const { test } = require('ava');
const ContextMiddleware = require('./middleware');

const getRequestDomain = require('./get-request-domain');

test('domain should be cleaned hostname', t => {
    const middleware = new ContextMiddleware({ fiaasEnvironment: 'prod' });

    const req = middleware.process({
        headers: {},
        hostname: 'www.finn.no',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    });
    const result1 = getRequestDomain(req);
    t.true(result1 === 'finn.no');

    req.hostname = 'finn2.no';
    const result2 = getRequestDomain(req);
    t.true(result2 === 'finn2.no');

    req.hostname = 'www.sub.finn3.no';
    const result3 = getRequestDomain(req);
    t.true(result3 === 'finn3.no');

    req.hostname = 'www.sub.finn.finntech.no';
    const result4 = getRequestDomain(req);
    t.true(result4 === 'finntech.no');
});

test('should match ips and localhost', t => {
    const middleware = new ContextMiddleware({ fiaasEnvironment: 'prod' });

    const req = middleware.process({
        headers: {},
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    });
    const result6 = getRequestDomain(req);
    t.true(result6 === 'localhost');

    req.hostname = 'localhost:1234';
    const result7 = getRequestDomain(req);
    t.true(result7 === 'localhost:1234');

    req.hostname = '127.0.0.1:1234';
    const result8 = getRequestDomain(req);
    t.true(result8 === '127.0.0.1:1234');
});

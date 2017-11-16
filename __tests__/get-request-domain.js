'use strict';

const getRequestDomain = require('../lib/get-request-domain');

test('domain should be cleaned hostname', async () => {
    const req = {
        headers: {},
        hostname: 'www.finn.no',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    };

    const result1 = await getRequestDomain(req);
    expect(result1).toBe('finn.no');

    req.hostname = 'finn2.no';
    const result2 = await getRequestDomain(req);
    expect(result2).toBe('finn2.no');

    req.hostname = 'www.sub.finn3.no';
    const result3 = await getRequestDomain(req);
    expect(result3).toBe('finn3.no');

    req.hostname = 'www.sub.finn.finntech.no';
    const result4 = await getRequestDomain(req);
    expect(result4).toBe('finntech.no');
});

test('should match ips and localhost', async () => {
    const req = {
        headers: {},
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    };

    const result6 = await getRequestDomain(req);
    expect(result6).toBe('localhost');

    req.hostname = 'localhost:1234';
    const result7 = await getRequestDomain(req);
    expect(result7).toBe('localhost:1234');

    req.hostname = '127.0.0.1:1234';
    const result8 = await getRequestDomain(req);
    expect(result8).toBe('127.0.0.1:1234');
});

/*
test('domain should be cleaned hostname', async () => {
    const req = await middleware(
        {
            headers: {},
            hostname: 'www.finn.no',
            url: '/some/path?x=1&a=2&b=3&c=4',
            body: 'asd',
        },
        null,
        () => {}
    );
    const result1 = getRequestDomain(req);
    expect(result1).toBe('finn.no');

    req.hostname = 'finn2.no';
    const result2 = getRequestDomain(req);
    expect(result2).toBe('finn2.no');

    req.hostname = 'www.sub.finn3.no';
    const result3 = getRequestDomain(req);
    expect(result3).toBe('finn3.no');

    req.hostname = 'www.sub.finn.finntech.no';
    const result4 = getRequestDomain(req);
    expect(result4).toBe('finntech.no');
});

test('should match ips and localhost', async () => {
    const req = await middleware(
        {
            headers: {},
            hostname: 'localhost',
            url: '/some/path?x=1&a=2&b=3&c=4',
            body: 'asd',
        },
        null,
        () => {}
    );
    const result6 = getRequestDomain(req);
    expect(result6).toBe('localhost');

    req.hostname = 'localhost:1234';
    const result7 = getRequestDomain(req);
    expect(result7).toBe('localhost:1234');

    req.hostname = '127.0.0.1:1234';
    const result8 = getRequestDomain(req);
    expect(result8).toBe('127.0.0.1:1234');
});
*/

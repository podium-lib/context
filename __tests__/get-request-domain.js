'use strict';

const RequestDomain = require('../lib/get-request-domain');

test('domain should be cleaned hostname', async () => {
    const req = {
        headers: {},
        hostname: 'www.finn.no',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    };

    const parser = new RequestDomain();

    const result1 = await parser.parse(req);
    expect(result1).toBe('finn.no');

    req.hostname = 'finn2.no';
    const result2 = await parser.parse(req);
    expect(result2).toBe('finn2.no');

    req.hostname = 'www.sub.finn3.no';
    const result3 = await parser.parse(req);
    expect(result3).toBe('finn3.no');

    req.hostname = 'www.sub.finn.finntech.no';
    const result4 = await parser.parse(req);
    expect(result4).toBe('finntech.no');
});

test('should match ips and localhost', async () => {
    const req = {
        headers: {},
        hostname: 'localhost',
        url: '/some/path?x=1&a=2&b=3&c=4',
        body: 'asd',
    };

    const parser = new RequestDomain();

    const result6 = await parser.parse(req);
    expect(result6).toBe('localhost');

    req.hostname = 'localhost:1234';
    const result7 = await parser.parse(req);
    expect(result7).toBe('localhost:1234');

    req.hostname = '127.0.0.1:1234';
    const result8 = await parser.parse(req);
    expect(result8).toBe('127.0.0.1:1234');
});

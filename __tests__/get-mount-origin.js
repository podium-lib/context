'use strict';

const MountOrigin = require('../lib/get-mount-origin');
const State = require('../lib/state');

test('PodiumContextMountOriginParser() - instantiate new object - should create an object', () => {
    const parser = new MountOrigin();
    expect(parser).toBeInstanceOf(MountOrigin);
});

test('PodiumContextMountOriginParser() - object tag - should be PodiumContextMountOriginParser', () => {
    const parser = new MountOrigin();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextMountOriginParser]',
    );
});

test('PodiumContextMountOriginParser() - "mountOrigin" argument has a illegal value - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new MountOrigin({ origin: 'x y' });
        parser.parse({});
    }).toThrow();
});

test('PodiumContextMountOriginParser() - "mountOrigin" argument has a legal value - should override request detection in parse()', () => {
    const parser = new MountOrigin({ origin: 'https://foo.bar.com' });

    const req = {
        originalUrl: 'http://www.finn.no',
        headers: {
            host: 'www.finn.no',
        },
        protocol: 'http:',
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://foo.bar.com');
});

test('PodiumContextMountOriginParser() - "req.protocol" is "http:" - should set "http://"', () => {
    const parser = new MountOrigin();

    const req = {
        originalUrl: 'http://www.finn.no',
        headers: {
            host: 'www.finn.no',
        },
        protocol: 'http:',
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://www.finn.no');
});

test('PodiumContextMountOriginParser() - "req.protocol" is "https:" - should set "https://"', () => {
    const parser = new MountOrigin();

    const req = {
        originalUrl: 'https://www.finn.no',
        headers: {
            host: 'www.finn.no',
        },
        protocol: 'https:',
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://www.finn.no');
});

test('PodiumContextMountOriginParser() - "req.protocol" is "undefined" - should set "http://"', () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: 'www.finn.no',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://www.finn.no');
});

test('PodiumContextMountOriginParser.parse() - "req.headers.host" has port - should set port', () => {
    const parser = new MountOrigin();

    const req = {
        originalUrl: 'http://www.finn.no:8080',
        headers: {
            host: 'www.finn.no:8080',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://www.finn.no:8080');
});

test('PodiumContextMountOriginParser.parse() - "req.port" is 80 - should not set port on result', () => {
    const parser = new MountOrigin();

    const req = {
        originalUrl: 'http://www.finn.no:80',
        headers: {
            host: 'www.finn.no:80',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://www.finn.no');
});

test('PodiumContextMountOriginParser.parse() - "req.port" is 443 - should not set port on result', () => {
    const parser = new MountOrigin();

    const req = {
        originalUrl: 'https://www.finn.no:443',
        headers: {
            host: 'www.finn.no:443',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://www.finn.no');
});

test('PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "port" set to 80 - should not set port on result', () => {
    const parser = new MountOrigin({ origin: 'https://foo.bar.com:80' });

    const req = {
        originalUrl: 'http://www.finn.no:8080',
        headers: {
            host: 'www.finn.no:8080',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://foo.bar.com');
});

test('PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "port" set to 443 - should not set port on result', () => {
    const parser = new MountOrigin({ origin: 'https://foo.bar.com:443' });

    const req = {
        originalUrl: 'http://www.finn.no:8080',
        headers: {
            host: 'www.finn.no:8080',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://foo.bar.com');
});

test('PodiumContextMountOriginParser.parse() - "req.hostname" is an ip address - should use ip as address', () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: '192.0.2.1:8080',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://192.0.2.1:8080');
});

test('PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "host" set to an ip address - should use ip as address', () => {
    const parser = new MountOrigin({ origin: 'http://192.0.2.1' });

    const req = {
        originalUrl: 'http://www.finn.no:8080',
        headers: {
            host: 'www.finn.no:8080',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('http://192.0.2.1');
});

test('PodiumContextMountOriginParser.parse() - "req.protocol" is http, "X-Forwarded-Proto" is https (behind proxy scenario) - should not set protocol to https on result', () => {
    const parser = new MountOrigin();

    const req = {
        protocol: 'http',
        headers: {
            'x-forwarded-proto': 'https',
            host: 'www.finn.no',
        },
    };

    const state = new State(req);
    const result = parser.parse(state);

    expect(result).toBe('https://www.finn.no');
});

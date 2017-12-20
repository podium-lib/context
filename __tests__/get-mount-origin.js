'use strict';

const MountOrigin = require('../lib/get-mount-origin');
const URL = require('url').URL;

test('ContextMountOriginParser() - instantiate new object - should create an object', () => {
    const parser = new MountOrigin();
    expect(parser).toBeInstanceOf(MountOrigin);
});

test('ContextMountOriginParser() - object tag - should be ContextMountOriginParser', () => {
    const parser = new MountOrigin();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object ContextMountOriginParser]'
    );
});

test('ContextMountOriginParser.parse() - "mount" argument has "protocol" set - should override protocol on parse()', async () => {
    const parser = new MountOrigin({
        protocol: 'https:',
    });

    const req = {
        headers: {
            host: 'www.finn.no',
        },
        protocol: 'http:',
    };

    const result = await parser.parse(req);
    expect(result).toBe('https://www.finn.no');
});

test('ContextMountOriginParser.parse() - "mount" argument has "host" set - should override host on parse()', async () => {
    const parser = new MountOrigin({
        hostname: 'foo.bar.com',
    });

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://foo.bar.com:8080');
});

test('ContextMountOriginParser.parse() - "mount" argument has "port" set - should override port on parse()', async () => {
    const parser = new MountOrigin({
        port: '7000',
    });

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no:7000');
});

test('ContextMountOriginParser.parse() - "req.headers.host" is not set - should default to "localhost"', async () => {
    const parser = new MountOrigin();

    const req = {};

    const result = await parser.parse(req);
    expect(result).toBe('http://localhost');
});

test('ContextMountOriginParser.parse() - "req.headers.host" has port - should set port', async () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no:8080');
});

test('ContextMountOriginParser.parse() - "req.port" is 80 - should not set port on result', async () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: 'www.finn.no:80',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no');
});

test('ContextMountOriginParser.parse() - "req.port" is 443 - should not set port on result', async () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: 'www.finn.no:443',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no');
});

test('ContextMountOriginParser.parse() - "mount" argument has "port" set to 80 - should not set port on result', async () => {
    const parser = new MountOrigin({
        port: '80',
    });

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no');
});

test('ContextMountOriginParser.parse() - "mount" argument has "port" set to 443 - should not set port on result', async () => {
    const parser = new MountOrigin({
        port: '443',
    });

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://www.finn.no');
});

test('ContextMountOriginParser.parse() - "req.hostname" is an ip address - should use ip as address', async () => {
    const parser = new MountOrigin();

    const req = {
        headers: {
            host: '192.0.2.1:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://192.0.2.1:8080');
});

test('ContextMountOriginParser.parse() - "mount" argument has "host" set to an ip address - should use ip as address', async () => {
    const parser = new MountOrigin({
        hostname: '192.0.2.1',
    });

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('http://192.0.2.1:8080');
});

test('ContextMountOriginParser.parse() - "mount" argument is a WHATWG URL object - should be accepted', async () => {
    const parser = new MountOrigin(new URL('https://www.finn.no:7000/foo/bar'));

    const req = {
        headers: {
            host: 'www.finn.no:8080',
        }
    };

    const result = await parser.parse(req);
    expect(result).toBe('https://www.finn.no:7000');
});

'use strict';

const MountPathname = require('../lib/get-mount-pathname');

test('PodiumContextMountPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new MountPathname();
    expect(parser).toBeInstanceOf(MountPathname);
});

test('PodiumContextMountPathnameParser() - object tag - should be PodiumContextMountPathnameParser', () => {
    const parser = new MountPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextMountPathnameParser]'
    );
});

test('PodiumContextMountPathnameParser.parse() - "mount" argument has "pathname" set - should override pathname on parse()', async () => {
    const parser = new MountPathname('/foo/bar/');

    const req = {
        originalUrl: '/bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/foo/bar/');
});

test('PodiumContextMountPathnameParser.parse() - "req.originalUrl" is not set - should default to "/"', async () => {
    const parser = new MountPathname();

    const req = {};

    const result = await parser.parse(req);
    expect(result).toBe('/');
});

test('PodiumContextMountPathnameParser.parse() - "req.originalUrl" is set - should resolve with set value', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo/');
});

test('PodiumContextMountPathnameParser.parse() - "req.originalUrl" does not start with a "/" - should prepend a "/"', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: 'bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo/');
});

test('PodiumContextMountPathnameParser.parse() - "req.originalUrl" does not end with a "/" - should not append a "/"', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: '/bar/foo',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo');
});

test('PodiumContextMountPathnameParser.parse() - "req.originalUrl" ends with an extension - should not append a "/"', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: '/bar/foo.html',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo.html');
});

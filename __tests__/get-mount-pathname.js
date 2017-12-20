'use strict';

const MountPathname = require('../lib/get-mount-pathname');
const URL = require('url').URL;

test('ContextMountPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new MountPathname();
    expect(parser).toBeInstanceOf(MountPathname);
});

test('ContextMountPathnameParser() - object tag - should be ContextMountPathnameParser', () => {
    const parser = new MountPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object ContextMountPathnameParser]'
    );
});

test('ContextMountPathnameParser.parse() - "mount" argument has "pathname" set - should override pathname on parse()', async () => {
    const parser = new MountPathname({
        pathname: '/foo/bar/',
    });

    const req = {
        originalUrl: '/bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/foo/bar/');
});

test('ContextMountPathnameParser.parse() - "req.originalUrl" is not set - should default to "/"', async () => {
    const parser = new MountPathname();

    const req = {};

    const result = await parser.parse(req);
    expect(result).toBe('/');
});

test('ContextMountPathnameParser.parse() - "req.originalUrl" is set - should resolve with set value', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo/');
});

test('ContextMountPathnameParser.parse() - "req.originalUrl" does not start with a "/" - should prepend a "/"', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: 'bar/foo/',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo/');
});

test('ContextMountPathnameParser.parse() - "req.originalUrl" does not end with a "/" - should append a "/"', async () => {
    const parser = new MountPathname();

    const req = {
        originalUrl: '/bar/foo',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/bar/foo/');
});


test('ContextMountPathnameParser.parse() - "mount" argument is a WHATWG URL object - should be accepted', async () => {
    const parser = new MountPathname(new URL('https://www.finn.no:7000/foo/bar'));

    const req = {
        originalUrl: '/bar/foo',
    };

    const result = await parser.parse(req);
    expect(result).toBe('/foo/bar/');
});

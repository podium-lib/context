'use strict';

const PublicPathname = require('../lib/get-public-pathname');
const URL = require('url').URL;

test('ContextPublicPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new PublicPathname();
    expect(parser).toBeInstanceOf(PublicPathname);
});

test('ContextPublicPathnameParser() - object tag - should be ContextPublicPathnameParser', () => {
    const parser = new PublicPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object ContextPublicPathnameParser]'
    );
});

test('ContextPublicPathnameParser.parse() - should resolve with a function', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    expect(resolver).toBeInstanceOf(Function);
});

test('ContextPublicPathnameParser.parse() - "mount" argument has "pathname" set - should override pathname on parse()', async () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
    });

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "req.originalUrl" is not set - should not set a pathname before the proxy pathname', async () => {
    const parser = new PublicPathname();

    const req = {};

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "req.originalUrl" is set - should resolve with set value', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "req.originalUrl" does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: 'bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "req.originalUrl" does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "name" on resolver method does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz/');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "name" on resolver method does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('/xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('ContextPublicPathnameParser.parse() - "name" on resolver method has no value - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        originalUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver();

    expect(result).toBe('/bar/foo/podium-resource/');
});

test('ContextPublicPathnameParser.parse() - "mount" argument is a WHATWG URL object - should be accepted', async () => {
    const parser = new PublicPathname(new URL('https://www.finn.no:7000/foo/bar'));

    const req = {
        originalUrl: '/bar/foo',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

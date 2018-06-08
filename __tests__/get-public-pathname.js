'use strict';

const PublicPathname = require('../lib/get-public-pathname');

test('PodiumContextPublicPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new PublicPathname();
    expect(parser).toBeInstanceOf(PublicPathname);
});

test('PodiumContextPublicPathnameParser() - object tag - should be PodiumContextPublicPathnameParser', () => {
    const parser = new PublicPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextPublicPathnameParser]'
    );
});

test('PodiumContextPublicPathnameParser.parse() - should resolve with a function', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    expect(resolver).toBeInstanceOf(Function);
});

test('PodiumContextPublicPathnameParser.parse() - "mount" argument has "pathname" set - should override pathname on parse()', async () => {
    const parser = new PublicPathname('/foo/bar/');

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "req.originalUrl" is not set - should not set a pathname before the proxy pathname', async () => {
    const parser = new PublicPathname();

    const req = {};

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "req.originalUrl" is set - should resolve with set value', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "req.originalUrl" does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "req.originalUrl" does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('xyz/');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver('/xyz');

    expect(result).toBe('/bar/foo/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method has no value - should append a "/"', async () => {
    const parser = new PublicPathname();

    const req = {
        baseUrl: '/bar/foo/',
    };

    const resolver = await parser.parse(req);
    const result = resolver();

    expect(result).toBe('/bar/foo/podium-resource/');
});

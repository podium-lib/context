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
    const resolver = await parser.parse();
    expect(resolver).toBeInstanceOf(Function);
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" is set - should set pathname on parse()', async () => {
    const parser = new PublicPathname({ pathname: '/foo/bar/' });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" is not set - should not set a pathname on parse()', async () => {
    const parser = new PublicPathname();

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname({ pathname: 'foo/bar/' });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname({ pathname: '/foo/bar' });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" is set - should override default on parse()', async () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: 'proxy',
    });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" does start with a / - should remove /', async () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: '/proxy',
    });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" does end with a / - should remove /', async () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: 'proxy/',
    });

    const resolver = await parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not start with a "/" - should prepend a "/"', async () => {
    const parser = new PublicPathname();

    const resolver = await parser.parse();
    const result = resolver('xyz/');

    expect(result).toBe('/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not end with a "/" - should append a "/"', async () => {
    const parser = new PublicPathname();

    const resolver = await parser.parse();
    const result = resolver('/xyz');

    expect(result).toBe('/podium-resource/xyz/');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method has no value - should append a "/"', async () => {
    const parser = new PublicPathname();

    const resolver = await parser.parse();
    const result = resolver();

    expect(result).toBe('/podium-resource/');
});

'use strict';

const PublicPathname = require('../lib/get-public-pathname');

test('PodiumContextPublicPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new PublicPathname();
    expect(parser).toBeInstanceOf(PublicPathname);
});

test('PodiumContextPublicPathnameParser() - object tag - should be PodiumContextPublicPathnameParser', () => {
    const parser = new PublicPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextPublicPathnameParser]',
    );
});

test('PodiumContextPublicPathnameParser.parse() - should resolve with a function', () => {
    const parser = new PublicPathname();
    const resolver = parser.parse();
    expect(resolver).toBeInstanceOf(Function);
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" is set - should set pathname on parse()', () => {
    const parser = new PublicPathname({ pathname: '/foo/bar/' });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" is not set - should not set a pathname on parse()', () => {
    const parser = new PublicPathname();

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" does not start with a "/" - should prepend a "/"', () => {
    const parser = new PublicPathname({ pathname: 'foo/bar/' });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('foo/bar/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "pathname" does not end with a "/" - should append a "/"', () => {
    const parser = new PublicPathname({ pathname: '/foo/bar' });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" is set - should override default on parse()', () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: 'proxy',
    });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" does start with a / - should remove /', () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: '/proxy',
    });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "prefix" does end with a / - should remove /', () => {
    const parser = new PublicPathname({
        pathname: '/foo/bar/',
        prefix: 'proxy/',
    });

    const resolver = parser.parse();
    const result = resolver('xyz');

    expect(result).toBe('/foo/bar/proxy/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not start with a "/" - should prepend a "/"', () => {
    const parser = new PublicPathname();

    const resolver = parser.parse();
    const result = resolver('xyz/');

    expect(result).toBe('/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not end with a "/" - should append a "/"', () => {
    const parser = new PublicPathname();

    const resolver = parser.parse();
    const result = resolver('/xyz');

    expect(result).toBe('/podium-resource/xyz');
});

test('PodiumContextPublicPathnameParser.parse() - "name" on resolver method has no value - should append a "/"', () => {
    const parser = new PublicPathname();

    const resolver = parser.parse();
    const result = resolver();

    expect(result).toBe('/podium-resource');
});

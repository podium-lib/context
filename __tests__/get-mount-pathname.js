'use strict';

const MountPathname = require('../lib/get-mount-pathname');

test('PodiumContextMountPathnameParser() - instantiate new object - should create an object', () => {
    const parser = new MountPathname();
    expect(parser).toBeInstanceOf(MountPathname);
});

test('PodiumContextMountPathnameParser() - object tag - should be PodiumContextMountPathnameParser', () => {
    const parser = new MountPathname();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextMountPathnameParser]',
    );
});

test('PodiumContextMountPathnameParser.parse() - no options set - should resolve with "/"', () => {
    const parser = new MountPathname();
    const result = parser.parse();
    expect(result).toBe('/');
});

test('PodiumContextMountPathnameParser.parse() - options object with "pathname" property set - should resolve with value of set property', () => {
    const parser = new MountPathname({ pathname: '/foo/bar/' });
    const result = parser.parse();
    expect(result).toBe('/foo/bar');
});

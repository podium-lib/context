'use strict';

const Debug = require('../lib/get-debug');

test('PodiumContextDebugParser() - instantiate new object - should create an object', () => {
    const parser = new Debug();
    expect(parser).toBeInstanceOf(Debug);
});

test('PodiumContextDebugParser() - object tag - should be PodiumContextDebugParser', () => {
    const parser = new Debug();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextDebugParser]',
    );
});

test('PodiumContextDebugParser() - no value given to "enabled" argument - .parse() should return false as a String', async () => {
    const parser = new Debug();
    const result = await parser.parse();
    expect(result).toEqual('false');
    expect(typeof result).toEqual('string');
});

test('PodiumContextDebugParser() - true value given to "enabled" argument - .parse() should return true as a String', async () => {
    const parser = new Debug({ enabled: true });
    const result = await parser.parse();
    expect(result).toEqual('true');
    expect(typeof result).toEqual('string');
});

test('PodiumContextDebugParser() - non boolean value given to "enabled" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new Debug({ enabled: 'tadi tadum' }); // eslint-disable-line no-unused-vars
    }).toThrowError('The value provided must be a boolean value.');
});

test('PodiumContextDebugParser.parse() - instantiated object - should have parse method', () => {
    const parser = new Debug();
    expect(parser.parse).toBeInstanceOf(Function);
});

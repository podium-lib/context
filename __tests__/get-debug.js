'use strict';

const Debug = require('../lib/get-debug');

test('ContextDebugParser() - instantiate new object - should create an object', () => {
    const parser = new Debug();
    expect(parser).toBeInstanceOf(Debug);
});

test('ContextDebugParser() - object tag - should be ContextDebugParser', () => {
    const parser = new Debug();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object ContextDebugParser]'
    );
});

test('ContextDebugParser() - no value given to "enabled" argument - .parse() should return false as a String', async () => {
    const parser = new Debug();
    const result = await parser.parse();
    expect(result).toEqual('false');
    expect(typeof result).toEqual('string');
});

test('ContextDebugParser() - true value given to "enabled" argument - .parse() should return true as a String', async () => {
    const parser = new Debug(true);
    const result = await parser.parse();
    expect(result).toEqual('true');
    expect(typeof result).toEqual('string');
});

test('ContextDebugParser() - non boolean value given to "enabled" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new Debug('tadi tadum');
    }).toThrowError('The value provided must be a boolean value.');
});

test('ContextDebugParser.parse() - instantiated object - should have parse method', () => {
    const parser = new Debug();
    expect(parser.parse).toBeInstanceOf(Function);
});

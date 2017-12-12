'use strict';

const RequestedBy = require('../lib/get-requested-by');

test('ContextRequestedByParser() - instantiate new object - should create an object', () => {
    const parser = new RequestedBy('foo');
    expect(parser).toBeInstanceOf(RequestedBy);
});

test('ContextRequestedByParser() - object tag - should be ContextRequestedByParser', () => {
    const parser = new RequestedBy('foo');
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object ContextRequestedByParser]'
    );
});

test('ContextRequestedByParser() - no value given to "name" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new RequestedBy();
    }).toThrowError('You must provide a value to "name".');
});

test('ContextRequestedByParser.parse() - instantiated object - should have parse method', () => {
    const parser = new RequestedBy('foo');
    expect(parser.parse).toBeInstanceOf(Function);
});

test('ContextRequestedByParser.parse() - call parse() - should return registered name', async () => {
    const parser = new RequestedBy('foo');
    const result = await parser.parse();
    expect(result).toEqual('foo');
});

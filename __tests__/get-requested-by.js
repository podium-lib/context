'use strict';

const RequestedBy = require('../lib/get-requested-by');

test('PodiumContextRequestedByParser() - instantiate new object - should create an object', () => {
    const parser = new RequestedBy({ name: 'foo' });
    expect(parser).toBeInstanceOf(RequestedBy);
});

test('PodiumContextRequestedByParser() - object tag - should be PodiumContextRequestedByParser', () => {
    const parser = new RequestedBy({ name: 'foo' });
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextRequestedByParser]'
    );
});

test('PodiumContextRequestedByParser() - no value given to "name" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new RequestedBy(); // eslint-disable-line no-unused-vars
    }).toThrowError('You must provide a value to "name".');
});

test('PodiumContextRequestedByParser.parse() - instantiated object - should have parse method', () => {
    const parser = new RequestedBy({ name: 'foo' });
    expect(parser.parse).toBeInstanceOf(Function);
});

test('PodiumContextRequestedByParser.parse() - call parse() - should return registered name', async () => {
    const parser = new RequestedBy({ name: 'foo' });
    const result = await parser.parse();
    expect(result).toEqual('foo');
});

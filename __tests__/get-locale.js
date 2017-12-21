'use strict';

const Locale = require('../lib/get-locale');

test('PodiumContextLocaleParser() - instantiate new object - should create an object', () => {
    const parser = new Locale();
    expect(parser).toBeInstanceOf(Locale);
});

test('PodiumContextLocaleParser() - object tag - should be PodiumContextLocaleParser', () => {
    const parser = new Locale();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextLocaleParser]'
    );
});

test('PodiumContextLocaleParser() - no value given to "locale" argument - .parse() should return "en-EN" as a String', async () => {
    const parser = new Locale();
    const result = await parser.parse();
    expect(result).toEqual('en-EN');
    expect(typeof result).toEqual('string');
});

test('PodiumContextLocaleParser() - legal value given to "locale" argument - .parse() should return given value as a String', async () => {
    const parser = new Locale('nb-NO');
    const result = await parser.parse();
    expect(result).toEqual('nb-NO');
    expect(typeof result).toEqual('string');
});

test('PodiumContextLocaleParser() - illegal value given to "locale" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new Locale('foo bar');
    }).toThrowError('Value provided to "locale" is not a valid locale: foo bar');
});

test('PodiumContextLocaleParser.parse() - instantiated object - should have parse method', () => {
    const parser = new Locale();
    expect(parser.parse).toBeInstanceOf(Function);
});

test('PodiumContextLocaleParser.parse() - value at "res.locals.locale" - .parse() should return given value', async () => {
    const parser = new Locale();
    const result = await parser.parse({}, {locals: {
        locale: 'nb-NO',
    }});
    expect(result).toEqual('nb-NO');
});

'use strict';

const { HttpIncoming } = require('@podium/utils');
const Locale = require('../lib/get-locale');

test('PodiumContextLocaleParser() - instantiate new object - should create an object', () => {
    const parser = new Locale();
    expect(parser).toBeInstanceOf(Locale);
});

test('PodiumContextLocaleParser() - object tag - should be PodiumContextLocaleParser', () => {
    const parser = new Locale();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextLocaleParser]',
    );
});

test('PodiumContextLocaleParser() - no value given to "locale" argument - .parse() should return "en-US" as a String', () => {
    const parser = new Locale();
    const result = parser.parse();
    expect(result).toEqual('en-US');
    expect(typeof result).toEqual('string');
});

test('PodiumContextLocaleParser() - legal value given to "locale" argument - .parse() should return given value as a String', () => {
    const parser = new Locale({ locale: 'nb-NO' });
    const result = parser.parse();
    expect(result).toEqual('nb-NO');
    expect(typeof result).toEqual('string');
});

test('PodiumContextLocaleParser() - illegal value given to "locale" argument - should throw', () => {
    expect.hasAssertions();
    expect(() => {
        const parser = new Locale({ locale: 'foo bar' }); // eslint-disable-line no-unused-vars
    }).toThrowError(
        'Value provided to "locale" is not a valid locale: foo bar',
    );
});

test('PodiumContextLocaleParser.parse() - instantiated object - should have parse method', () => {
    const parser = new Locale();
    expect(parser.parse).toBeInstanceOf(Function);
});

test('PodiumContextLocaleParser.parse() - value at "HttpIncoming.params.locale" - .parse() should return given value', () => {
    const parser = new Locale();
    const incoming = new HttpIncoming(
        {
            originalUrl: 'http://www.finn.no',
            headers: {
                host: 'www.finn.no',
            },
            protocol: 'http:',
        },
        {},
        {
            locale: 'nb-NO',
        },
    );

    const result = parser.parse(incoming);
    expect(result).toEqual('nb-NO');
});

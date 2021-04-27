'use strict';

const tap = require('tap');
const { HttpIncoming } = require('@podium/utils');
const Locale = require('../lib/get-locale');

tap.test(
    'PodiumContextLocaleParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new Locale();
        t.true(parser instanceof Locale);
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser() - object tag - should be PodiumContextLocaleParser',
    (t) => {
        const parser = new Locale();
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextLocaleParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser() - no value given to "locale" argument - .parse() should return "en-US" as a String',
    (t) => {
        const parser = new Locale();
        const result = parser.parse();
        t.equal(result, 'en-US');
        t.type(result, 'string');
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser() - legal value given to "locale" argument - .parse() should return given value as a String',
    (t) => {
        const parser = new Locale({ locale: 'nb-NO' });
        const result = parser.parse();
        t.equal(result, 'nb-NO');
        t.type(result, 'string');
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser() - illegal value given to "locale" argument',
    (t) => {
        t.plan(1);
        t.throws(
            () => {
                const parser = new Locale({ locale: 'foo bar' }); // eslint-disable-line no-unused-vars
            },
            /Value provided to "locale" is not a valid locale: foo bar/,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser.parse() - instantiated object - should have parse method',
    (t) => {
        const parser = new Locale();
        t.type(parser.parse, 'function');
        t.end();
    },
);

tap.test(
    'PodiumContextLocaleParser.parse() - value at "HttpIncoming.params.locale" - .parse() should return given value',
    (t) => {
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
        t.equal(result, 'nb-NO');
        t.end();
    },
);

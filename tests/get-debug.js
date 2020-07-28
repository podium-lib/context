'use strict';

const tap = require('tap');
const Debug = require('../lib/get-debug');

tap.test(
    'PodiumContextDebugParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new Debug();
        t.true(parser instanceof Debug);
        t.end();
    },
);

tap.test(
    'PodiumContextDebugParser() - object tag - should be PodiumContextDebugParser',
    (t) => {
        const parser = new Debug();
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextDebugParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextDebugParser() - no value given to "enabled" argument - .parse() should return false as a String',
    (t) => {
        const parser = new Debug();
        const result = parser.parse();
        t.equal(result, 'false');
        t.type(result, 'string');
        t.end();
    },
);

tap.test(
    'PodiumContextDebugParser() - true value given to "enabled" argument - .parse() should return true as a String',
    (t) => {
        const parser = new Debug({ enabled: true });
        const result = parser.parse();
        t.equal(result, 'true');
        t.type(result, 'string');
        t.end();
    },
);

tap.test(
    'PodiumContextDebugParser() - non boolean value given to "enabled" argument',
    (t) => {
        t.plan(1);
        t.throws(
            () => {
                const parser = new Debug({ enabled: 'tadi tadum' }); // eslint-disable-line no-unused-vars
            },
            /The value provided must be a boolean value./,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextDebugParser.parse() - instantiated object - should have parse method',
    (t) => {
        const parser = new Debug();
        t.type(parser.parse, 'function');
        t.end();
    },
);

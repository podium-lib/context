'use strict';

const tap = require('tap');
const RequestedBy = require('../lib/get-requested-by');

tap.test(
    'PodiumContextRequestedByParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new RequestedBy({ name: 'foo' });
        t.true(parser instanceof RequestedBy);
        t.end();
    },
);

tap.test(
    'PodiumContextRequestedByParser() - object tag - should be PodiumContextRequestedByParser',
    (t) => {
        const parser = new RequestedBy({ name: 'foo' });
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextRequestedByParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextRequestedByParser() - no value given to "name" argument',
    (t) => {
        t.plan(1);
        t.throws(
            () => {
                const parser = new RequestedBy(); // eslint-disable-line no-unused-vars
            },
            /You must provide a value to "name"./,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextRequestedByParser.parse() - instantiated object - should have parse method',
    (t) => {
        const parser = new RequestedBy({ name: 'foo' });
        t.true(parser.parse instanceof Function);
        t.end();
    },
);

tap.test(
    'PodiumContextRequestedByParser.parse() - call parse() - should return registered name',
    (t) => {
        const parser = new RequestedBy({ name: 'foo' });
        const result = parser.parse();
        t.equal(result, 'foo');
        t.end();
    },
);

'use strict';

const tap = require('tap');
const MountPathname = require('../lib/get-mount-pathname');

tap.test(
    'PodiumContextMountPathnameParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new MountPathname();
        t.true(parser instanceof MountPathname);
        t.end();
    },
);

tap.test(
    'PodiumContextMountPathnameParser() - object tag - should be PodiumContextMountPathnameParser',
    (t) => {
        const parser = new MountPathname();
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextMountPathnameParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextMountPathnameParser.parse() - no options set - should resolve with "/"',
    (t) => {
        const parser = new MountPathname();
        const result = parser.parse();
        t.equal(result, '/');
        t.end();
    },
);

tap.test(
    'PodiumContextMountPathnameParser.parse() - options object with "pathname" property set - should resolve with value of set property',
    (t) => {
        const parser = new MountPathname({ pathname: '/foo/bar/' });
        const result = parser.parse();
        t.equal(result, '/foo/bar');
        t.end();
    },
);

import tap from 'tap';
import PublicPathname from '../lib/get-public-pathname.js';

tap.test(
    'PodiumContextPublicPathnameParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new PublicPathname();
        t.ok(parser instanceof PublicPathname);
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser() - object tag - should be PodiumContextPublicPathnameParser',
    (t) => {
        const parser = new PublicPathname();
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextPublicPathnameParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - should resolve with a function',
    (t) => {
        const parser = new PublicPathname();
        const resolver = parser.parse();
        t.ok(resolver instanceof Function);
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "pathname" is set - should set pathname on parse()',
    (t) => {
        const parser = new PublicPathname({ pathname: '/foo/bar/' });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/foo/bar/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "pathname" is not set - should not set a pathname on parse()',
    (t) => {
        const parser = new PublicPathname();

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "pathname" does not start with a "/" - should prepend a "/"',
    (t) => {
        const parser = new PublicPathname({ pathname: 'foo/bar/' });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, 'foo/bar/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "pathname" does not end with a "/" - should append a "/"',
    (t) => {
        const parser = new PublicPathname({ pathname: '/foo/bar' });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/foo/bar/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "prefix" is set - should override default on parse()',
    (t) => {
        const parser = new PublicPathname({
            pathname: '/foo/bar/',
            prefix: 'proxy',
        });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/foo/bar/proxy/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "prefix" does start with a / - should remove /',
    (t) => {
        const parser = new PublicPathname({
            pathname: '/foo/bar/',
            prefix: '/proxy',
        });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/foo/bar/proxy/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "prefix" does end with a / - should remove /',
    (t) => {
        const parser = new PublicPathname({
            pathname: '/foo/bar/',
            prefix: 'proxy/',
        });

        const resolver = parser.parse();
        const result = resolver('xyz');

        t.equal(result, '/foo/bar/proxy/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not start with a "/" - should prepend a "/"',
    (t) => {
        const parser = new PublicPathname();

        const resolver = parser.parse();
        const result = resolver('xyz/');

        t.equal(result, '/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "name" on resolver method does not end with a "/" - should append a "/"',
    (t) => {
        const parser = new PublicPathname();

        const resolver = parser.parse();
        const result = resolver('/xyz');

        t.equal(result, '/podium-resource/xyz');
        t.end();
    },
);

tap.test(
    'PodiumContextPublicPathnameParser.parse() - "name" on resolver method has no value - should append a "/"',
    (t) => {
        const parser = new PublicPathname();

        const resolver = parser.parse();
        const result = resolver();

        t.equal(result, '/podium-resource');
        t.end();
    },
);

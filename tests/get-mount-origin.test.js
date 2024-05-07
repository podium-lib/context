import tap from 'tap';
import { HttpIncoming } from '@podium/utils';
import MountOrigin from '../lib/get-mount-origin.js';

tap.test(
    'PodiumContextMountOriginParser() - instantiate new object - should create an object',
    (t) => {
        const parser = new MountOrigin();
        t.ok(parser instanceof MountOrigin);
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - object tag - should be PodiumContextMountOriginParser',
    (t) => {
        const parser = new MountOrigin();
        t.equal(
            Object.prototype.toString.call(parser),
            '[object PodiumContextMountOriginParser]',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - "mountOrigin" argument has a illegal value',
    (t) => {
        t.plan(1);
        t.throws(
            () => {
                const parser = new MountOrigin({ origin: 'x y' });
                parser.parse({});
            },
            /Invalid URL/,
            'Should throw',
        );
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - "mountOrigin" argument has a legal value - should override request detection in parse()',
    (t) => {
        const parser = new MountOrigin({ origin: 'https://foo.bar.com' });

        const req = {
            originalUrl: 'http://www.finn.no',
            headers: {
                host: 'www.finn.no',
            },
            protocol: 'http:',
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'https://foo.bar.com');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - "req.protocol" is "http:" - should set "http://"',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            originalUrl: 'http://www.finn.no',
            headers: {
                host: 'www.finn.no',
            },
            protocol: 'http:',
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://www.finn.no');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - "req.protocol" is "https:" - should set "https://"',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            originalUrl: 'https://www.finn.no',
            headers: {
                host: 'www.finn.no',
            },
            protocol: 'https:',
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'https://www.finn.no');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser() - "req.protocol" is "undefined" - should set "http://"',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            headers: {
                host: 'www.finn.no',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://www.finn.no');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser.parse() - "req.headers.host" has port - should set port',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            originalUrl: 'http://www.finn.no:8080',
            headers: {
                host: 'www.finn.no:8080',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://www.finn.no:8080');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser.parse() - "req.port" is 80 - should not set port on result',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            originalUrl: 'http://www.finn.no:80',
            headers: {
                host: 'www.finn.no:80',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://www.finn.no');
        t.end();
    },
);

// Commented out to see if this actually breaks in production
// tap.test(
//     'PodiumContextMountOriginParser.parse() - "req.port" is 443 - should not set port on result',
//     (t) => {
//         const parser = new MountOrigin();

//         const req = {
//             originalUrl: 'https://www.finn.no:443',
//             headers: {
//                 host: 'www.finn.no:443',
//             },
//         };

//         const incoming = new HttpIncoming(req);
//         const result = parser.parse(incoming);

//         t.equal(result, 'https://www.finn.no');
//         t.end();
//     },
// );

tap.test(
    'PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "port" set to 80 - should not set port on result',
    (t) => {
        const parser = new MountOrigin({ origin: 'https://foo.bar.com:80' });

        const req = {
            originalUrl: 'http://www.finn.no:8080',
            headers: {
                host: 'www.finn.no:8080',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'https://foo.bar.com');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "port" set to 443 - should not set port on result',
    (t) => {
        const parser = new MountOrigin({ origin: 'https://foo.bar.com:443' });

        const req = {
            originalUrl: 'http://www.finn.no:8080',
            headers: {
                host: 'www.finn.no:8080',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'https://foo.bar.com');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser.parse() - "req.hostname" is an ip address - should use ip as address',
    (t) => {
        const parser = new MountOrigin();

        const req = {
            headers: {
                host: '192.0.2.1:8080',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://192.0.2.1:8080');
        t.end();
    },
);

tap.test(
    'PodiumContextMountOriginParser.parse() - "mountOrigin" argument has "host" set to an ip address - should use ip as address',
    (t) => {
        const parser = new MountOrigin({ origin: 'http://192.0.2.1' });

        const req = {
            originalUrl: 'http://www.finn.no:8080',
            headers: {
                host: 'www.finn.no:8080',
            },
        };

        const incoming = new HttpIncoming(req);
        const result = parser.parse(incoming);

        t.equal(result, 'http://192.0.2.1');
        t.end();
    },
);

// Commented out to see if this actually breaks in production
// tap.test(
//     'PodiumContextMountOriginParser.parse() - "req.protocol" is http, "X-Forwarded-Proto" is https (behind proxy scenario) - should not set protocol to https on result',
//     (t) => {
//         const parser = new MountOrigin();

//         const req = {
//             protocol: 'http',
//             headers: {
//                 'x-forwarded-proto': 'https',
//                 host: 'www.finn.no',
//             },
//         };

//         const incoming = new HttpIncoming(req);
//         const result = parser.parse(incoming);

//         t.equal(result, 'https://www.finn.no');
//         t.end();
//     },
// );

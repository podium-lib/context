import tap from 'tap';
import { HttpIncoming } from '@podium/utils';
import BaseFontSizeParser from '../lib/get-base-font-size.js';

tap.test(
    'PodiumContextBaseFontSizeParser() - returns the expected default value',
    (t) => {
        const parser = new BaseFontSizeParser();
        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
            },
            hostname: 'localhost',
            url: '/some/path',
        });
        t.ok(parser instanceof BaseFontSizeParser);
        t.equal(parser.parse(incoming), '1rem');
        t.end();
    },
);

tap.test(
    'PodiumContextBaseFontSizeParser() - sets the expected font size from the incoming request',
    (t) => {
        const parser = new BaseFontSizeParser();
        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
                'x-podium-base-font-size': '2rem',
            },
            hostname: 'localhost',
            url: '/some/path',
        });
        t.ok(parser instanceof BaseFontSizeParser);
        t.equal(parser.parse(incoming), '2rem');
        t.end();
    },
);

tap.test(
    'PodiumContextBaseFontSizeParser() - picks latter of multiple header values',
    (t) => {
        const parser = new BaseFontSizeParser();
        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
                'x-podium-base-font-size': '13rem',
                // eslint-disable-next-line no-dupe-keys
                'x-podium-base-font-size': '2rem',
            },
            hostname: 'localhost',
            url: '/some/path',
        });
        t.ok(parser instanceof BaseFontSizeParser);
        t.equal(parser.parse(incoming), '2rem');
        t.end();
    },
);

import { HttpIncoming } from '@podium/utils';
import tap from 'tap';
import AppId from '../lib/get-app-id.js';

tap.test('PodiumContextAppIdParser() - by default returns undefined', (t) => {
    const parser = new AppId();

    const incoming = new HttpIncoming({
        headers: {
            host: 'localhost:3030',
        },
        hostname: 'localhost',
        url: '/some/path',
    });

    t.ok(parser instanceof AppId);
    t.equal(parser.parse(incoming), undefined);
    t.end();
});

tap.test(
    'PodiumContextAppIdParser() - sets the expected app ID value from the incoming request',
    (t) => {
        const parser = new AppId();

        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
                'x-podium-app-id': 'com.example.app@1.2.3',
            },
            hostname: 'localhost',
            url: '/some/path',
        });

        t.ok(parser instanceof AppId);
        t.equal(parser.parse(incoming), 'com.example.app@1.2.3');
        t.end();
    },
);

tap.test(
    'PodiumContextAppIdParser() - picks latter of multiple header values',
    (t) => {
        const parser = new AppId();

        const incoming = new HttpIncoming({
            headers: {
                host: 'localhost:3030',
                'x-podium-app-id': 'fizz.buzz@4.3.2',
                // eslint-disable-next-line no-dupe-keys
                'x-podium-app-id': 'com.example.app@1.2.3',
            },
            hostname: 'localhost',
            url: '/some/path',
        });

        t.ok(parser instanceof AppId);
        t.equal(parser.parse(incoming), 'com.example.app@1.2.3');
        t.end();
    },
);

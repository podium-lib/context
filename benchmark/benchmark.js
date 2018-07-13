'use strict';

const benchmark = require('benchmark');
const Context = require('../');

const HEADER_RICH = {
    host: 'localhost:3030',
    'user-agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36',
    accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    cookie:
        '__flt_dev=token-string; finnSessionId=session-id-string; podium-bucket=%7B%7DM; USERID=123',
    'trace-id': 'trace-uuid',
    'accept-encoding': 'gzip, deflate, sdch, br',
    'accept-language':
        'nb-NO,nb;q=0.8,no;q=0.6,nn;q=0.4,en-US;q=0.2,en;q=0.2,da;q=0.2,sv;q=0.2',
};

const suite = new benchmark.Suite();

const add = (name, fn) => {
    suite.add(name, fn);
};

const context = new Context({ name: 'foo' });
const middleware = context.middleware();
const req = {
    headers: HEADER_RICH,
    hostname: 'localhost',
    url: '/some/path?x=1&a=2&b=3&c=4',
    cookies: { USERID: '123' },
};
const res = {};

const times = 4;
for (let i = 0; i < times; i++) {
    add(`middleware() - Run ${i}`, {
        defer: true,
        fn(deferred) {
            middleware(req, res, () => {
                deferred.resolve();
            });
        },
    });
}

suite
    .on('cycle', ev => {
        console.log(ev.target.toString());
        if (ev.target.error) {
            console.error(ev.target.error);
        }
    })
    .run();

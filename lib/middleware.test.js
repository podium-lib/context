'use strict';

const middleware = require('./middleware');

test('should run middlewares if missing', async () => {
    const req = {
        headers: {
            'user-agent': 'some user agent',
        },
        url: 'http://www.finn.no/some/url?and=param&andOlso=stuff',
    };
    middleware(req, null, () => {});
    expect(req.query).toEqual({ and: 'param', andOlso: 'stuff' });
    expect(req.deviceType).toBe('desktop');
});

test('should not run middlewares if already runned', async () => {
    const deviceType = Symbol();
    const query = Symbol();
    const req = {
        headers: {
            'user-agent': 'some user agent',
        },
        deviceType,
        query,
    };
    middleware(req, null, () => {});
    expect(req.deviceType).toBe(deviceType);
    expect(req.query).toBe(query);
});

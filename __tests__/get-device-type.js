'use strict';

const getDeviceType = require('../lib/get-device-type');

test('device type is not a real UA', async () => {
    const req = {
        headers: {
            'user-agent': 'some user agent',
        },
    };
    const result = await getDeviceType(req);
    expect(result).toBe('desktop');
});

/*
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
*/

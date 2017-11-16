'use strict';

const getTraceId = require('../lib/get-trace-id');

test('get trace-id', async () => {
    const req = {
        headers: {
            'X-B3-TraceId': 'trace-id-ish',
        },
    };

    const result = await getTraceId(req);
    expect(result).toBe('trace-id-ish');
});

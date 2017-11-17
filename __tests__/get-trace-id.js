'use strict';

const TraceId = require('../lib/get-trace-id');

test('get trace-id', async () => {
    const req = {
        headers: {
            'X-B3-TraceId': 'trace-id-ish',
        },
    };

    const parser = new TraceId();
    const result = await parser.parse(req);
    expect(result).toBe('trace-id-ish');
});

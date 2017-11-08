'use strict';

const middleware = require('./middleware');
const getTraceId = require('./get-trace-id');

test('get trace-id', async () => {
    const provide = await middleware(
        {
            headers: {
                'X-B3-TraceId': 'trace-id-ish',
            },
        },
        null,
        () => {},
    );
    const result = getTraceId(provide);
    expect(result).toBe('trace-id-ish');
});

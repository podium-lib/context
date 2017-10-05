'use strict';

const { test } = require('ava');
const ContextMiddleware = require('./middleware');
const getTraceId = require('./get-trace-id');

test('get trace-id', async t => {
    const provide = await ContextMiddleware.process({
        headers: {
            'X-B3-TraceId': 'trace-id-ish',
        },
    });
    const result = getTraceId(provide);
    t.true(result === 'trace-id-ish');
});

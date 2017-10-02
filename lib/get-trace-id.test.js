'use strict';

const { test } = require('ava');
const { setup } = require('./helpers/test-helpers');
const getTraceId = require('./get-trace-id');

test('get trace-id', async t => {
    const { middleware } = setup({ fiaasEnvironment: 'prod' });
    const provide = await middleware.process({
        headers: {
            'X-B3-TraceId': 'trace-id-ish',
        },
    });
    const result = getTraceId(provide);
    t.true(result === 'trace-id-ish');
});

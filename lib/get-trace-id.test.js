'use strict';

const { test } = require('ava');
const ContextMiddleware = require('./middleware');

const getTraceId = require('./get-trace-id');

test('get trace-id', t => {
    const middleware = new ContextMiddleware({ finnEnv: 'prod' });
    const provide = middleware.process({
        headers: {
            'X-B3-TraceId': 'trace-id-ish',
        },
    });
    const result = getTraceId(provide);
    t.true(result === 'trace-id-ish');
});

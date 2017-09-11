'use strict';

const { test } = require('ava');
const ContextMiddleware = require('./middleware');

const getSessionId = require('./get-session-id');

test('sessionId', async t => {
    const middleware = new ContextMiddleware({ fiaasEnvironment: 'prod' });
    const provide = middleware.process({ sessionId: '1234', headers: {} });
    const result = getSessionId(provide);
    t.true(result === provide.sessionId);
});

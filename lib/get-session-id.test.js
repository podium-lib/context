'use strict';

const { test } = require('ava');
const { setup } = require('./helpers/test-helpers');

const getSessionId = require('./get-session-id');

test('sessionId', async t => {
    const { middleware } = setup({ fiaasEnvironment: 'prod' });
    const provide = await middleware.process({
        sessionId: '1234',
        headers: {},
    });
    const result = getSessionId(provide);
    t.true(result === provide.sessionId);
});

'use strict';

const ContextMiddleware = require('./middleware');

const getSessionId = require('./get-session-id');

test('sessionId', async () => {
    const provide = await ContextMiddleware.process({
        sessionId: '1234',
        headers: {},
    });
    const result = getSessionId(provide);
    expect(result).toBe(provide.sessionId);
});

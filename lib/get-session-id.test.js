'use strict';

const middleware = require('./middleware');

const getSessionId = require('./get-session-id');

test('sessionId', async () => {
    const provide = await middleware(
        {
            sessionId: '1234',
            headers: {},
        },
        null,
        () => {},
    );
    const result = getSessionId(provide);
    expect(result).toBe(provide.sessionId);
});

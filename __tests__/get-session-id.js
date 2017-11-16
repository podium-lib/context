'use strict';

const getSessionId = require('../lib/get-session-id');

test('sessionId', async () => {
    const req = {
        sessionId: '1234',
    };

    const result = await getSessionId(req);
    expect(result).toBe('1234');
});

test('sessionID', async () => {
    const req = {
        sessionID: '1234',
    };

    const result = await getSessionId(req);
    expect(result).toBe('1234');
});

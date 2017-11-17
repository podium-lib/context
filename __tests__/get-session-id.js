'use strict';

const SessionId = require('../lib/get-session-id');

test('sessionId', async () => {
    const req = {
        sessionId: '1234',
    };
    const parser = new SessionId();
    const result = await parser.parse(req);
    expect(result).toBe('1234');
});

test('sessionID', async () => {
    const req = {
        sessionID: '1234',
    };

    const parser = new SessionId();
    const result = await parser.parse(req);
    expect(result).toBe('1234');
});

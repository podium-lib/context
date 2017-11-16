'use strict';

const getRequestedBy = require('../lib/get-requested-by');

test('get-requested-by - default - should return "podium-context-client"', async () => {
    const result = await getRequestedBy();
    expect(result).toBe('podium-context-client');
});

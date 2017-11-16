'use strict';

const getDebug = require('../lib/get-debug');

test('get-debug - default - should return "false"', async () => {
    const result = await getDebug();
    expect(result).toBe('false');
});

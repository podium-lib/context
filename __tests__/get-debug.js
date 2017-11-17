'use strict';

const Debug = require('../lib/get-debug');

test('get-debug - default - should return "false"', async () => {
    const parser = new Debug();
    const result = await parser.parse();
    expect(result).toBe('false');
});

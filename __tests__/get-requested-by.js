'use strict';

const RequestedBy = require('../lib/get-requested-by');

test('get-requested-by - default - should return "podium-context-client"', async () => {
    const parser = new RequestedBy();
    const result = await parser.parse();
    expect(result).toBe('podium-context-client');
});

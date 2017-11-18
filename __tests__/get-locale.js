'use strict';

const Locale = require('../lib/get-locale');

test('get-locale - default - should return nb-NO', async () => {
    const parser = new Locale();
    const result = await parser.parse();
    expect(result).toBe('nb-NO');
});

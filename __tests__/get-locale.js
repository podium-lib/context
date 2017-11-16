'use strict';

const getLocale = require('../lib/get-locale');

test('get-locale - default - should return nb-NO', async () => {
    const result = await getLocale();
    expect(result).toBe('nb-NO');
});

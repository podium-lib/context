'use strict';

const Joi = require('joi');
const { contextSchema } = require('./schema');

test('context schema', () => {
    const obj = {
        domain: 'finn.no',
        baseUrl: 'https://www.finn.no',
        deviceType: 'mobile',
        resourceMountPath: '/podium/',
        userAgent: 'ua',
    };
    const res = Joi.validate(obj, contextSchema);
    expect(res.error).toBeFalsy();
});

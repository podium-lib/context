'use strict';

const { test } = require('ava');
const Joi = require('joi');
const { contextSchema } = require('./schema');

test('context schema', t => {
    const obj = {
        domain: 'finn.no',
        baseUrl: 'https://www.finn.no',
        deviceType: 'mobile',
        resourceMountPath: '/podium/',
        userAgent: 'ua',
    };
    const res = Joi.validate(obj, contextSchema);
    t.ifError(res.error);
});

'use strict';

const Joi = require('joi');
const { contextSchema } = require('./schema');

const base = {
    domain: 'finn.no',
    baseUrl: 'https://www.finn.no',
    deviceType: 'mobile',
    resourceMountPath: '/podium/',
    userAgent: 'ua',
};

test('context schema', () => {
    const res = Joi.validate({ ...base }, contextSchema);
    expect(res.error).toBeFalsy();
});

test('should validate locale en-GB', () => {
    const locale = 'en-GB';
    const res = Joi.validate({ ...base, locale }, contextSchema);
    expect(res.error).toBeFalsy();
    expect(res.value.locale).toBe(locale);
});

test('should validate default locale', () => {
    const locale = 'nb-NO';
    const res = Joi.validate({ ...base }, contextSchema);
    expect(res.error).toBeFalsy();
    expect(res.value.locale).toBe(locale);
});

test('should validate locale nn-NO', () => {
    const locale = 'nn-NO';
    const res = Joi.validate({ ...base, locale }, contextSchema);
    expect(res.error).toBeFalsy();
    expect(res.value.locale).toBe(locale);
});

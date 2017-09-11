'use strict';

const { test } = require('ava');
const { fromPodiumRequest, toPodiumRequest } = require('./serialize');

test('toPodiumRequest', t => {
    const result = toPodiumRequest({
        userAgent: 'ua',
        stuff: 'x',
    });
    t.deepEqual(result, {
        headers: { 'podium-user-agent': 'ua', 'podium-stuff': 'x' },
        query: {},
    });
});

test('toPodiumRequest with query', t => {
    const result = toPodiumRequest({
        userAgent: 'ua',
        stuff: 'x',
        query: {
            a: 'b',
        },
    });
    t.deepEqual(result, {
        headers: { 'podium-user-agent': 'ua', 'podium-stuff': 'x' },
        query: {
            a: 'b',
        },
    });
});

test('fromPodiumRequest', t => {
    t.deepEqual(
        fromPodiumRequest({
            headers: {
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        }),
        { query: {}, stuff: 'x' }
    );
});

test('fromPodiumRequest should skip not needed stuff', t => {
    t.deepEqual(
        fromPodiumRequest({
            headers: {
                host: 'xyz.com',
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        }),
        {
            query: {},
            stuff: 'x',
        }
    );
});

test('fromPodiumRequest should skip not needed stuff', t => {
    t.deepEqual(
        fromPodiumRequest({
            headers: {
                host: 'xyz.com',
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        }),
        { query: {}, stuff: 'x' }
    );
});

test('toPodiumRequest should not have undefined/null/emptry-string values', t => {
    const result = toPodiumRequest({
        value: null,
        value1: undefined,
        value2: false,
        value3: '',
    });
    t.deepEqual(result.headers, { 'podium-value2': false });
});

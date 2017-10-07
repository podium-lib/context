'use strict';

const { fromPodiumRequest, toPodiumRequest } = require('./serialize');

test('toPodiumRequest', () => {
    const result = toPodiumRequest({
        userAgent: 'ua',
        stuff: 'x',
    });
    expect(result).toEqual({
        headers: { 'podium-user-agent': 'ua', 'podium-stuff': 'x' },
        query: {},
    });
});

test('toPodiumRequest with query', () => {
    const result = toPodiumRequest({
        userAgent: 'ua',
        stuff: 'x',
        query: {
            a: 'b',
        },
    });
    expect(result).toEqual({
        headers: { 'podium-user-agent': 'ua', 'podium-stuff': 'x' },
        query: {
            a: 'b',
        },
    });
});

test('fromPodiumRequest', () => {
    expect(
        fromPodiumRequest({
            headers: {
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        })
    ).toEqual({ query: {}, stuff: 'x' });
});

test('fromPodiumRequest should skip not needed stuff', () => {
    expect(
        fromPodiumRequest({
            headers: {
                host: 'xyz.com',
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        })
    ).toEqual({
        query: {},
        stuff: 'x',
    });
});

test('fromPodiumRequest should skip not needed stuff', () => {
    expect(
        fromPodiumRequest({
            headers: {
                host: 'xyz.com',
                'user-agent': 'ua',
                'podium-stuff': 'x',
            },
        })
    ).toEqual({ query: {}, stuff: 'x' });
});

test('toPodiumRequest should not have undefined/null/emptry-string values', () => {
    const result = toPodiumRequest({
        value: null,
        value1: undefined,
        value2: false,
        value3: '',
    });
    expect(result.headers).toEqual({ 'podium-value2': false });
});

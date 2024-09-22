import {
    describe,
    expect,
    test,
} from '@jest/globals';

import { sanitizeInteger } from '../src/configs';

describe('Test sanitizeInteger', () => {
    test('Should correctly return expectedValue for valid number', () => {
        const expectedValue = 4000;
        const defaultValue = 3000;
        const returnValue = sanitizeInteger(`${expectedValue}`, defaultValue);
        expect(returnValue).toBe(expectedValue);
    });
    test('Should correctly return defaultValue for invalid number ', () => {
        const expectedValue = 'Number';
        const defaultValue = 1;
        const returnValue = sanitizeInteger(`${expectedValue}`, defaultValue);
        expect(returnValue).toBe(defaultValue);
    });
    test('Should correctly return defaultValue for negitive number ', () => {
        const expectedValue = -1000;
        const defaultValue = 12;
        const returnValue = sanitizeInteger(`${expectedValue}`, defaultValue);
        expect(returnValue).toBe(defaultValue);
    });
    test('Should correctly return defaultValue for value 0 ', () => {
        const expectedValue = 0;
        const defaultValue = 12;
        const returnValue = sanitizeInteger(`${expectedValue}`, defaultValue);
        expect(returnValue).toBe(defaultValue);
    });
});

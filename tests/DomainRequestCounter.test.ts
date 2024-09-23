import DomainRequestCounter from '../src/DomainRequestCounter';
import {
    describe, expect, test,
    beforeEach,
} from '@jest/globals';
describe('DomainRequestCounter', () => {
    let counter: DomainRequestCounter;

    beforeEach(() => {
        counter = new DomainRequestCounter();
    });

    test('should initialize with zero count for any domain', () => {
        expect(counter.getCount('domain-a.com')).toBe(0);
    });

    test('should increment the count for a domain', () => {
        counter.increment('domain-a.com');
        expect(counter.getCount('domain-a.com')).toBe(1);
    });

    test('should increment the count multiple times for a domain', () => {
        counter.increment('domain-a.com');
        counter.increment('domain-a.com');
        expect(counter.getCount('domain-a.com')).toBe(2);
    });

    test('should decrement the count for a domain', () => {
        counter.increment('domain-a.com');
        counter.increment('domain-a.com');
        counter.decrement('domain-a.com');
        expect(counter.getCount('domain-a.com')).toBe(1);
    });

    test('should remove the domain when count reaches zero after decrement', () => {
        counter.increment('domain-a.com');
        counter.decrement('domain-a.com');
        expect(counter.getCount('domain-a.com')).toBe(0);
    });

    test('should not decrement below zero', () => {
        counter.decrement('domain-a.com');
        expect(counter.getCount('domain-a.com')).toBe(0);
    });
});
class DomainRequestCounter {
    private inProgressDomainRequestCounter: Map<string, number>;

    constructor() {
        this.inProgressDomainRequestCounter = new Map();
    }

    increment(domainIdentifier: string): void {
        this.inProgressDomainRequestCounter.set(
            domainIdentifier,
            (this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0) + 1
        );
    }

    decrement(domainIdentifier: string): void {
        const currentCount = this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0;
        if (currentCount <= 1) {
            this.inProgressDomainRequestCounter.delete(domainIdentifier);
        } else {
            this.inProgressDomainRequestCounter.set(domainIdentifier, currentCount - 1);
        }
    }

    getCount(domainIdentifier: string): number {
        return this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0;
    }
}

export default DomainRequestCounter;
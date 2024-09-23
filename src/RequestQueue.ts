import queueRequestType from './types/queueRequest';

class RequestQueue {
    private requestQueue: Map<string, queueRequestType[]>;

    constructor() {
        this.requestQueue = new Map();
    }

    addRequest(domainIdentifier: string, request: queueRequestType): void {
        if (!this.requestQueue.has(domainIdentifier)) {
            this.requestQueue.set(domainIdentifier, []);
        }
        // disable eslint for the next line because we know that the key exists
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.requestQueue.get(domainIdentifier)!.push(request);
    }

    getNextRequest(domainIdentifier: string): queueRequestType | undefined {
        return this.requestQueue.get(domainIdentifier)?.shift();
    }

    hasRequests(domainIdentifier: string): boolean {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.requestQueue.has(domainIdentifier) && this.requestQueue.get(domainIdentifier)!.length > 0;
    }
}

export default RequestQueue;
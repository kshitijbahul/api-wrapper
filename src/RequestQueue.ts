import queueRequestType from './types/queueRequest';

class RequestQueue {
    private requestQueue: Map<string, Array<queueRequestType>>;

    constructor() {
        this.requestQueue = new Map();
    }

    addRequest(domainIdentifier: string, request: queueRequestType): void {
        if (!this.requestQueue.has(domainIdentifier)) {
            this.requestQueue.set(domainIdentifier, []);
        }
        this.requestQueue.get(domainIdentifier)!.push(request);
    }

    getNextRequest(domainIdentifier: string): queueRequestType | undefined {
        return this.requestQueue.get(domainIdentifier)?.shift();
    }

    hasRequests(domainIdentifier: string): boolean {
        return this.requestQueue.has(domainIdentifier) && this.requestQueue.get(domainIdentifier)!.length > 0;
    }
}

export default RequestQueue;
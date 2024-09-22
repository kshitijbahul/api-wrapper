import { IHttpClient } from './IHttpClient';
import { retries, retryDelay } from '../configs';
import { retryWithBackoff } from '../utils/retry.utils';
import { getDomainKeyFromUrl } from '../utils/url.utils';
import RequestQueue from '../RequestQueue';
import DomainRequestCounter from '../DomainRequestCounter';
import ExternalAPIError from '../errors/ExternalAPI.error';


class HttpClient implements IHttpClient {
    private concurrentDomainRequestLimit: number;
    private requestsInProgress: Map<string, Promise<any>>;
    private requestQueue: RequestQueue;
    private domainRequestCounter: DomainRequestCounter;

    constructor(concurrencyLimit: number) {
        if (concurrencyLimit <= 0) {
            throw new Error('Concurrency limit must be a positive integer');
        }
        this.concurrentDomainRequestLimit = concurrencyLimit;
        this.requestsInProgress = new Map();
        this.requestQueue = new RequestQueue();
        this.domainRequestCounter = new DomainRequestCounter();
    }

    async get(requestUrl: string): Promise<any> {
        const url = requestUrl.toLowerCase();
        const domainIdentifier = getDomainKeyFromUrl(url);

        if (this.requestsInProgress.has(url)) {
            console.log('Found request in progress. Returning existing promise', url);
            return this.requestsInProgress.get(url);
        }

        if (this.domainRequestCounter.getCount(domainIdentifier) >= this.concurrentDomainRequestLimit) {
            console.log('Max requests for domain reached. Queueing request for URL', url);
            return this.queueRequest(url, domainIdentifier);
        }

        return this.performRequest(url, domainIdentifier);
    }

    private queueRequest(url: string, domainIdentifier: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Max requests in progress. Queueing request for URL', url);
            this.requestQueue.addRequest(domainIdentifier, { url, resolve, reject });
        });
    }

    private async performRequest(url: string, domainIdentifier: string): Promise<any> {
        this.domainRequestCounter.increment(domainIdentifier);

        const requestPromise = retryWithBackoff(() => fetch(url)
            .then(async (response) => {
                if (!response.ok) {
                    throw new ExternalAPIError(`Error from upstream API ${response.status}`, response.status);
                }
                return response.json();
            }), retries, retryDelay)
            .finally(() => {
                this.onRequestComplete(url, domainIdentifier);
            });

        this.requestsInProgress.set(url, requestPromise);

        return requestPromise;
    }

    private onRequestComplete(url: string, domainIdentifier: string): void {
        this.domainRequestCounter.decrement(domainIdentifier);
        this.requestsInProgress.delete(url);

        if (this.requestQueue.hasRequests(domainIdentifier)) {
            this.processNextRequest(domainIdentifier);
        }
    }

    private processNextRequest(domainIdentifier: string): void {
        const nextRequest = this.requestQueue.getNextRequest(domainIdentifier);
        if (nextRequest) {
            const { url, resolve, reject } = nextRequest;
            this.get(url).then(resolve).catch(reject);
        }
    }
}

export default HttpClient;
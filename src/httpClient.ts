import queueRequestType from './types/queueRequest';
import { retries, retryDelay } from './configs';
import { retryWithBackoff } from './retry';

class HttpClient {
    concurrentDomainRequestLimit: number;
    /*
        Map to store the request in requestInProgress
        key : URL
        value : Promise
    */
    requestsInProgress: Map<string, Promise<any>>;
    /*
        Map to track the number of ongoing requests to a domain
        key : Unique Domain
        value : Number of ongoing requests
    */
    inProgressDomainRequestCounter: Map<string, number>;
    /*
        Map to store the queued requests 
        key :  Unique Domain
        value : Array of requests
    */
    requestQueue: Map<string, Array<queueRequestType>>;
    constructor(concurrencyLimit:number) {
        if (concurrencyLimit <= 0) {
            throw new Error('Concurrency limit must be a positive integer');
        }
        this.concurrentDomainRequestLimit = concurrencyLimit;
        this.requestsInProgress = new Map();
        this.inProgressDomainRequestCounter = new Map();
        this.requestQueue = new Map();
    }
    private getDomainKeyFromUrl(url: string): string {
        // Assume that if the port is not specified, it is port 80 for HTTP and 443 for HTTPS
        // handle port for HTTPS requests and assume we get HTTP/HTTPS only
        const parsedUrl = new URL(url);
        const port  = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
        return `${parsedUrl.hostname}:${port}`;
    }
    /*
        Entry Method to Perform a GET request
        - It is responsible for the pre-validations 
        - Returning early in case of repeated responses 
        - Queuing the request if the limit is reached
        - Performing the request if the limit is not reached
    */
    async getData(requestUrl:string): Promise<any> {
        const url = requestUrl.toLowerCase();
        const domainIdentifier = this.getDomainKeyFromUrl(url);
        if (this.requestsInProgress.has(url)) {
            console.log('Found request in progress. Returning existing promise', url);
            return this.requestsInProgress.get(url);
        }

        if (!this.inProgressDomainRequestCounter.has(domainIdentifier)) {
            this.inProgressDomainRequestCounter.set(domainIdentifier, 0);
        }

        if (this.inProgressDomainRequestCounter.get(domainIdentifier)! >= this.concurrentDomainRequestLimit) {
            console.log('Max requests for domain reached. Queueing request for URL', url);
            return this.queueRequest(url, domainIdentifier);
        }
        return this.performRequest(url, domainIdentifier);
    }
    /*
        This method is for the queuing of a request
    */
    queueRequest(url:string, domainIdentifier:string): Promise<any> {
        // Ensuring a key is set for the domain before we do a push
        if (!this.requestQueue.has(domainIdentifier)) {
            this.requestQueue.set(domainIdentifier, []);
        }

        return new Promise((resolve, reject) => {
            console.log('Max requests in progress. Queueing request for URL', url);
            this.requestQueue.get(domainIdentifier)!.push({ url, resolve, reject });
        });
    }
    /*
        Method to perform a request
        - It will increase the counter for ongoing requests
        - It will perform the fetch request
        - It will handle the response and errors
        - It will call the onRequestComplete to handle the completion of the request
    */
    async performRequest(url:string, domainIdentifier:string): Promise<any> {
        this.inProgressDomainRequestCounter.set(
            domainIdentifier,
            (this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0) + 1
        );

        const requestPromise = retryWithBackoff(() =>
            fetch(url)
                .then((response) => {
                    console.log('Fetch is called');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }),
            retries, retryDelay)
            .finally(() => {
                this.onRequestComplete(url, domainIdentifier);
            });
        this.requestsInProgress.set(url, requestPromise);

        return requestPromise;
    }
    /*
        Method to handle the completion of the request
        - It will decrease the counter for ongoing requests
        - It will remove the request from the requestInProgress
        - It will check if there are any pending requests for the domain and process the next request
    */
    onRequestComplete(url:string, domainIdentifier:string):void {
        // Remove the request from the domain counter 
        const currentCount = this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0;
        if (currentCount === 1) {
            this.inProgressDomainRequestCounter.delete(domainIdentifier);
        } else {
            this.inProgressDomainRequestCounter.set(domainIdentifier, currentCount - 1);
        }
        // Remove the request from requestInProgress
        this.requestsInProgress.delete(url);
        // Check if there are any pending requests for the domain
        if (this.requestQueue.has(domainIdentifier) && this.requestQueue.get(domainIdentifier)!.length > 0) {
            this.processNextRequest(domainIdentifier);
        }
    }
    /*
        Method to process the next request in the queue
        - It will get the next request from the queue
        - It will call the getData method to perform the request
    */
    processNextRequest(domainIdentifier:string):void {
        // We use shift to ensure that we process the requests in the order they are queued (FIFO)
        const { url: nextUrl, resolve, reject } = this.requestQueue.get(domainIdentifier)!.shift()!;
        // We call getData to perform the request to take advantage of the 
        // fact that if we dequeue a request and have the same request that has now come, both can be processed and possibly use each other's promise
        // We could also call performRequest here and skip the pre-processing of getData
        this.getData(nextUrl).then(resolve).catch(reject);
    }
}

export default HttpClient;
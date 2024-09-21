/* type HttpClientType = {
    concurrentDomianRequestLimit: number;
    requestInProgress: Map<string, Promise<any>>;
    inProgressDomainRequestCounter: Map<string, number>;
    requestQueue: Map<string, Array<string>>;
    getData: (requestUrl: string) => Promise<any>;
} */


class HttpClient {
    concurrentDomianRequestLimit: number;
    /*
        Map to store the request in requestInProgress
        key : URL
        value : Promise
    */
    requestsInProgress: Map<string, Promise<any>>;
    /*
        Map to track number of ongoing request to a domain
        key : Unique Domain
        value : Number of ongoing request
    */
    inProgressDomainRequestCounter: Map<string, number>;
    /*
         Map to store the queue the request 
        key :  Unique Domian
        value : Array of requests
    */
    requestQueue: Map<string, Array<string>>;
    constructor() {
        this.concurrentDomianRequestLimit = 3;
        this.requestsInProgress = new Map();
        this.inProgressDomainRequestCounter = new Map();
        this.requestQueue = new Map();
    }
    private getDomainKeyFromUrl(url: string): string {
        // Assume that the port is not specified is port 80 for HTTP and 443 for HTTPS
        // handle port for HTTPS requests and assume we get HTTP/HTTPS only
        const parsedUrl = new URL(url);
        const port  = parsedUrl.port || (parsedUrl.protocol=='https' ? 443 : 80);
        return `${parsedUrl.hostname}:${port}`;
    }
    /*
        Entry Method to Perform a get request
        - It is responsibel for the pre validations 
        - Returning early in case of repeated responses 
        - Queuing the request if the limit is reached
        - Performing the request if the limit is not reached

    */
    async getData(requestUrl:string): Promise<any> {
        const url = requestUrl.toLowerCase();
        const domainIdentifier = this.getDomainKeyFromUrl(url);
        if (this.requestsInProgress.has(url)) {
            console.log(' Found request in progress Returnign existing promise ', url);
            return this.requestsInProgress.get(url);
        }

        if (!this.inProgressDomainRequestCounter.has(domainIdentifier)) {
            this.inProgressDomainRequestCounter.set(domainIdentifier, 0);
        }

        if (this.inProgressDomainRequestCounter.get(domainIdentifier) >= this.concurrentDomianRequestLimit) {
            console.log('Max reuests for domain reached Queue Request for URL ', url);
            // queue the request
        }
        console.log('Permornign request for  ', url);
        return this.performRequest(url, domainIdentifier);
    }
    
    /*
        Method to perform a request
        - It will increase the counter for ongoing request
        - It will perform the fetch request
        - It will handle the response and error
        - It will call the onRequestComplete to handle the completion of the request
    */
    async performRequest(url:string, domainIdentifier:string): Promise<any> {
        this.inProgressDomainRequestCounter.set(
            domainIdentifier,
            (this.inProgressDomainRequestCounter.get(domainIdentifier) ?? 0) + 1
        );

        const requestPromise = fetch(url)
                                .then((response) => {
                                    console.log('Timeout is called');
                                    console.log('Fetch is called ');
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .finally(() => {
                                    console.log('Finally is called');
                                    this.onRequestComplete(url, domainIdentifier);
                                });

        this.requestsInProgress.set(url, requestPromise);

        return requestPromise;
    }
    /*
        Method to handle the completion of the request
        - It will decrease the counter for ongoing request
        - It will remove the request from the requestInProgress
        - It will check if there are any pending requests for the domain and process the next request
    */
    onRequestComplete(url:string, domainIdentifier:string):void {
        // Remove the request from the domain counter 
        const currentCount = this.inProgressDomainRequestCounter.get(domainIdentifier);
        if (currentCount === 1) {
            this.inProgressDomainRequestCounter.delete(domainIdentifier);
        } else {
            this.inProgressDomainRequestCounter.set(domainIdentifier, currentCount - 1);
        }
        // Remove the request from the requestInProgress
        this.requestsInProgress.delete(url);
        console.log('OnRequestComplete is called now checking if there are any pending requests');
        // Check if there are any pending requests for the domain
        
    }
    /*
        Method to process the next request in the queue
        - It will get the next request from the queue
        - It will call the getData method to perform the request
    */
    processNextRequest(domainIdentifier):void {
        
    }
}

export default HttpClient;
class HttpClient {
    constructor() {
        this.concurrentDomianRequestLimit = 3;
        /*
            Map to store the request in requestInProgress
            key : URL
            value : Promise
        */
        this.requestInProgress = new Map();
        /*
            Map to track number of ongoing request to a domain
            key : Unique Domain
            value : Number of ongoing request
        */
        this.inProgressDomainRequestCounter = new Map();
        /*
         Map to store the queue the request 
        key :  Unique Domian
        value : Array of requests
        */
        this.requestQueue = new Map();
    }
}

export default HttpClient;
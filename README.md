This Repository creates an API wrapper around an existing API to  implement asome optimizations and network communication policies.

### Swagger Docs

http://localhost:3000/api-docs/

### Assumptions 
- We get only https or http requests
- We recieve GET requests 
- Not conscidering Redirects in the response 

### TODOs 
- Expose the API
- API documentation
- Build Process
- Sharing the deliverable 
- Adding config variables
- Tests in TS

### Commands 

- test : npm run test
- 
###### Task 
### Optimizing concurrent HTTP GET requests
Your task is to optimize a hypothetical application that performs a large number of HTTP GET operations to fetch web resources concurrently.

The application is expected to perform many requests in parallel. Your job is to provide a replacement API wrapper for the API that the application is using to perform the requests, in order to implement a set of optimizations and network communication policies at the API layer.

## The optimizations and policies that needs to be implemented:

If a request for a specific URL is already in flight, then do not send another identical HTTP request, but instead use the response of the in-flight request to satisfy any additional calls from the application.
If there are already 3 in-flight requests going to a specific TCP/IP endpoint (unique host and port combination), then queue up additional requests to that endpoint, so that the maximum number of in-flight requests for a given TCP/IP endpoint does not exceed 3 at any given time.

## For the sake of simplicity, the API is not expected to

use any HTTP method other than GET.
deal with passing along HTTP request or response headers.
do any caching or authentication
resolve host names in order to determine unique TCP/IP endpoints. Plain string comparison is sufficient.
support streaming HTTP message bodies. A plain string or byte sequence (your choice) is sufficient.
allow requests to be canceled.

## The API is however expected to

allow for error handling in the application
treat the whole URL string, including any query parameters, as part of the unique identity of the URL.

You are free to design the API that the application will use to perform the HTTP requests in any way you like, using any programming language you like, and using the execution environment of your choice, (command line, browser and server environments are all fine). Depending on the availability of such features in the programming language of your choice, you may choose to provide the ability to perform concurrent requests using one of the following mechanisms:

- Callback functions for reporting completion of asynchronous requests.
- Return “promise”, “future”, “task” or “deferred” objects representing the future - completion of the asynchronous request.
- Provide a blocking function that expects to be called from multiple threads.
- Us e language native channel primitives (such as in Go or Erlang)

An API consisting of a single function to perform an asynchronous request is acceptable. Make sure to document how to use the API that you implement.

You can use the GET /anything API endpoint at https://httpbin.org/ for testing.

Your solution to this programming task will be evaluated using the following criteria, in order of descending importance:

Maintainability
Correctness
Efficiency


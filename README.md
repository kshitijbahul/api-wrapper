# API Wrapper Project

This repository creates an API wrapper around an existing API to implement some optimizations and network communication policies.

## Local Run Instructions

### Prerequisites
- [Docker](https://www.docker.com/)

### Setup With Docker

1. **Clone the repository**:
   ```sh
   git clone 
   cd api-wrapper
2. ***Build docker Image *** 
   ```docker build -f Dockerfile -t api-wrapper .
3. ***Build docker Image *** 
    
   ```docker run -p 3000:3000 api-wrapper



### Swagger Docs

You can access the Swagger documentation at: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### Assumptions 
- We get only HTTPS or HTTP requests.
- We receive GET requests.
- Not considering redirects in the response.

### TODOs 
- Tests in TypeScript
- Build Process
- Sharing the deliverable
- Instructions to run locally



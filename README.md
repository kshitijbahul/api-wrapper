# API Wrapper Project

This repository creates an API wrapper around an existing API to implement some optimizations and network communication policies.

## Local Run Instructions

### Prerequisites
- [Docker](https://www.docker.com/)

### Setup With Docker

1. **Clone the repository**:
   ```sh
   git clone https://github.com/kshitijbahul/api-wrapper
   cd api-wrapper
2. ***Build docker Image***:
   ```sh
   docker build -f Dockerfile -t api-wrapper .
3. ***Build docker Image***: 
    
    You can choose to run the docker image with a port of your choice, to do so enter an available port in  the following command  
    ```docker run -p <PORT_OF_YOUR_CHOICE>:3000 api-wrapper```
    
    In the command below, I have choosen this port to be 3000
    ```sh 
   docker run -p 3000:3000 api-wrapper
### API documentation

Once the Docker image is running you can access the 
the API documentation at: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

> **Note:** If you have changed the port in the step ***Build docker Image***, change the port in the link above accordingly.

### Assumptions 
- We get only HTTPS or HTTP requests.
- We receive GET requests.
- Redirects in the response are not conscidered.

### TODOs 
- Tests in TypeScript
- Build Process
- Sharing the deliverable
- Instructions to run locally



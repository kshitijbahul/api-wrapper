# API Wrapper Project

This repository creates an API wrapper around an existing API to implement some optimizations and network communication policies.

## Local Run Instructions with Docker

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

### Testing 

The App can be tested in the following ways

1. ***Using the API docs page***:
   
   Using the link to the API documentation above to test the API
2. ***Using the Curl Requests***:
   
   Here is a sample curl request that can be used to test the application
   ```sh
   curl --location 'localhost:3000/api/v1/proxy'
   --header 'Content-Type: application/json' \
   --data '{
    "url": "https://httpbin.org/get"
    }'


## Local Run Instructions Using Node.js

If you prefer to run the project locally using **Node.js**, follow these steps:

### Prerequisites
- **Node.js** installed on your machine (version 20+ recommended).
- **npm** (included with Node.js).

### Local Setup

1. **Install Node.js**:
First, ensure that **Node.js** is installed on your system. You can download it from [here](https://nodejs.org/en/download/) and follow the installation instructions for your operating system.

To check if Node.js and npm are correctly installed, run:
- node -v
- npm -v

2. **Clone the repository**:
   ```sh
   git clone https://github.com/kshitijbahul/api-wrapper
   cd api-wrapper
3. ***Install dependencies***:
   ```sh
   npm install

4. ***Changing the local port ***:
   
   If you want to change the default port (3000), you can modify the port in the ```.env``` file in the base directory

5. ***Build project***: 
    
    ```sh 
   npm run build
6. ***Run the project ***:
   ```sh
   npm start

### API documentation

Once the Docker image is running you can access the 
the API documentation at: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

> **Note:** If you have changed the port in the step ***Step 4 above***, change the port in the link above accordingly.

### Testing 

The App can be tested in the following ways

1. ***Using Jest***:
   Open a new terminal and navigate to the base directory of the project andn run 
   
   ```sh
   npm test
   
2. ***Using the Curl Requests***:
   
   Here is a sample curl request that can be used to test the application
   ```sh
   curl --location 'localhost:3000/api/v1/proxy'
   --header 'Content-Type: application/json' \
   --data '{
    "url": "https://httpbin.org/get"
    }'
> **Note:** If you have changed the port in the step ***Step 4 above***, change the port in the sample above accordingly.
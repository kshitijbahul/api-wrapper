import HttpClient from '../src/httpClient';


// Mock fetch
global.fetch = jest.fn();

describe(' Test HttpClient Wrapper', () => {
    let httpClient;
    beforeAll(()=> {
        
    });
    beforeEach(()=> {
        httpClient = new HttpClient();
        fetch.mockClear();
    });
    afterAll(()=> {
        jest.resetAllMocks();        
    });

    test('Can get Data from a URL', async() => {
        const url = 'https://httpbin.org/get?param=1';
        httpClient.getData(url);
    });
    test('Can use response of an in-flight request', async() => {});
    test('Can queue up requests to an endpoint after its already serving 3 request', async() => {});
    test('Can enforce concurrency check, with  4 calls to the same API with different params', async() => {});
    test('Will return an error if the Downstream API retunrs an error', async() => {});
    
});
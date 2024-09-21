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

    test('Should get Data from a URL', async() => {
        const url = 'https://httpbin.org/get?param=1';
        // Mock fetch response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });
        const data = await httpClient.getData(url);
        expect(data).toEqual({ success: true });
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url);
    });

    test('Should return an error if the Downstream API retunrs an error', async() => {
        const url = 'https://httpbin.org/get?param=1';

        // Mock fetch to return a 500 error
        fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn(),
        });

        await expect(httpClient.getData(url)).rejects.toThrow('HTTP error! status: 500');

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('Should use response of an in-flight request', async() => {
        const url = 'https://httpbin.org/get?param=1';

        // Mock fetch
        fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
        });

        // Initiate two concurrent requests
        const [data1, data2] = await Promise.all([httpClient.getData(url), httpClient.getData(url)]);

        expect(data1).toEqual({ success: true });
        expect(data2).toEqual({ success: true });
        // Only one fetch call should be made
        expect(fetch).toHaveBeenCalledTimes(1);
    });
    test('Should queue up requests to an endpoint after its already serving 3 request', async() => {

    });
    test('Should enforce concurrency check, with  4 calls to the same API with different params', async() => {

    });
    
    
});
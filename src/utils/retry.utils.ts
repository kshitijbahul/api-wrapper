import ExternalAPIError from '../errors/ExternalAPI.error';

// Define the status codes that should be retried
const retryableStatusCodes = [500, 502, 503, 504, 429 ];


export const retryWithBackoff = async <T>(
    fn: () => Promise<T>, 
    retries = 3, 
    delay = 1000
): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            // Call the provided function
            return await fn();
        } catch (error: any) {
            console.log(`Error occured: ${error}`);
            if (error instanceof ExternalAPIError && retryableStatusCodes.includes(error.status)) {
                if (i === retries - 1) {
                    // If the maximum number of retries is reached, Throw custom error
                    throw new Error(`Remote server is not responding. Error recieved: ${error.message}`);
                }
                // Calculate backoff delay
                const retryDelay = delay * Math.pow(2, i);
                console.log(`Retrying after ${retryDelay} ms...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }else {
                throw error;
            }
            
            
        }
    }

    // This should not be reached
    throw new Error('Unexpected error in retry logic');
};

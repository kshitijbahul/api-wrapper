export const retryWithBackoff = async <T>(
    fn: () => Promise<T>, 
    retries: number = 3, 
    delay: number = 1000
): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            // Call the provided function
            return await fn();

        } catch (error: any) {
            // If the maximum number of retries is reached, Throw custom error
            if (i === retries - 1) {
                throw new Error(`Remote server is not responding. Error recieved: ${error.message}`);
            }

            // Calculate backoff delay
            const retryDelay = delay * Math.pow(2, i);
            console.log(`Retrying after ${retryDelay} ms...`);

            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    // This should not be reached
    throw new Error('Unexpected error in retry logic');
};

export const retryWithBackoff = async <T>(
    fn: () => Promise<T>, 
    retries: number = 3, 
    delay: number = 1000
): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        // console.log('retryWithBackoff is called');

        try {
            // Simulate an error to demonstrate retry logic
            /* if (i < 2) {
                throw new Error('HTTP error! status: 429');
            } */

            // Attempt to call the provided function
            return await fn();

        } catch (error: any) {
            // If the maximum number of retries has been reached, rethrow the error
            if (i === retries - 1) {
                throw error;
            }

            // Implement exponential backoff delay
            const retryDelay = delay * Math.pow(2, i);
            console.log(`Retrying after ${retryDelay} ms...`);

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    // This line will never be reached, as the loop either returns or throws
    throw new Error('Unexpected error in retry logic');
};

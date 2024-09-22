import dotenv from 'dotenv';
dotenv.config();

// Function to validate and sanitize integer inputs
export function sanitizeInteger(value: string | undefined, defaultValue: number): number {
  
  const parsedValue = parseInt(value || '', 10);
  // The passed value should be a number and greater than 0
  return (!isNaN(parsedValue)  && parsedValue > 0) ? parsedValue : defaultValue;
}

// Port on which the application will run
export const applicationPort: number = sanitizeInteger(process.env.APPLICATION_PORT, 3000);
// Base path for the API
export const basePath: string = '/api/v1';
// Maximum number of concurrent requests to a domain
export const concurrentDomainRequestLimit: number = sanitizeInteger(process.env.CONCURRENT_DOMAIN_REQUEST_LIMIT, 3);
// Maximum number of requests that can be queued for a domain
export const maxQueueLimitPerDomain: number = sanitizeInteger(process.env.MAX_QUEUE_LIMIT_PER_DOMAIN, 10);
// Maximum number of requests that can be queued in the application
export const maxQueueDepth: number = maxQueueLimitPerDomain * 100;
// Number of retries for a failed request
export const retries: number = sanitizeInteger(process.env.RETRIES, 3);
// Delay between retries in milliseconds
export const retryDelay: number = sanitizeInteger(process.env.RETRY_DELAY, 1000);
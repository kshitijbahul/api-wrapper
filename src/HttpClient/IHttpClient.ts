// Interface for an HttpClient
// Currently only with a get method
// Can be extended to include other methods like postData, putData, etc.
export interface IHttpClient {
	get(requestUrl: string): Promise<any>;
}

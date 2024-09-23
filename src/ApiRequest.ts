class ApiRequest {
	private url: string;
	private method: string;

	constructor(url: string, method: string) {
		this.url = url;
		this.method = method;
	}
}

export default ApiRequest;

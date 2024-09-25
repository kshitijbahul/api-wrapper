class ApiResponse {
	status: number;
	protected responseBody: unknown;
	protected error: string;
	constructor(status: number, responseBody: unknown, error: string) {
		this.status = status;
		this.responseBody = responseBody;
		this.error = error;
	}
}

export default ApiResponse;

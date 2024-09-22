class ExternalAPIError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ExternalAPIError';
    }
}

export default ExternalAPIError;
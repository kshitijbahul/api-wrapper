import ApiResponse from "../ApiResponse";

interface QueueRequestType {
	url: string;
	resolve: (value: Promise<ApiResponse>) => void;
	reject: (reason?: Promise<Error | string>) => void;
}

export default QueueRequestType;

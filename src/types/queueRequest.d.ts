interface queueRequestType {
	url: string;
	resolve: (value: Promise<any>) => void;
	reject: (reason?: Promise<any>) => void;
}

export default queueRequestType;

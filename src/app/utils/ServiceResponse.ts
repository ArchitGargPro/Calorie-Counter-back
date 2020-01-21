class ServiceResponse<T = any> {
    public static success<T = any>(data: T, message = '',  dataLength?: number, httpCode?: number): ServiceResponse {
        if (!dataLength) {
            if (data) {
                if (Array.isArray(data)) {
                    dataLength = data.length;
                } else {
                    dataLength = 1;
                }
            } else {
                dataLength = 0;
            }
        }
        return new ServiceResponse<T>(true, data, message, httpCode, dataLength);
    }

    public static error<T = any>(errorMessage: string, httpCode?: number): ServiceResponse {
        return new ServiceResponse<T>(false, null, errorMessage, httpCode, 0);
    }

    public success: boolean;
    public data: T;
    public message: string;
    public httpCode?: number;
    public dataLength?: number;

    constructor(success: boolean, data: T, message: string, httpCode: number | undefined | null, dataLength: number) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.httpCode = httpCode ? httpCode : (success ? 200 : 400);
        this.dataLength = dataLength;
    }
}

export default ServiceResponse;

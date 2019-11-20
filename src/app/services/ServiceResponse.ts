class ServiceResponse<T = any> {
    public static success<T = any>(data: T, message = '', httpCode?: number): ServiceResponse {
        return new ServiceResponse<T>(true, data, message, httpCode);
    }

    public static error<T = any>(errorMessage: string, httpCode?: number): ServiceResponse {
        return new ServiceResponse<T>(false, null, errorMessage, httpCode);
    }

    public success: boolean;
    public data: T;
    public message: string;
    public httpCode?: number;

    constructor(success: boolean, data: T, message: string, httpCode: number | undefined | null) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.httpCode = httpCode ? httpCode : (success ? 200 : 400);
    }
}

export default ServiceResponse;

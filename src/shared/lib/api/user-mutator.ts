import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { authApiService } from '@/shared/lib/services/ApiService';

export const customUserInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = authApiService.getAxiosInstance()({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }: AxiosResponse<T>) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

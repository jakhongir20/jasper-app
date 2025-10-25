import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { apiService } from '@/shared/lib/services/ApiService';

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = apiService.getAxiosInstance()({
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

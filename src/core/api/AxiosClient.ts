import axios, { AxiosInstance } from 'axios';
import { API_URL, API_KEY } from '@env';
import { HttpClient, HttpParams } from './HttpClient';

export class AxiosClient implements HttpClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para API Key (igual que antes, pero encapsulado aquí)
        this.axiosInstance.interceptors.request.use((config) => {
            if (config.headers) {
                config.headers['x-api-key'] = API_KEY;
            }
            return config;
        });
    }

    async get<T>(url: string, params?: HttpParams): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, { params });
        return response.data;
    }

    async post<T>(url: string, body: any): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, body);
        return response.data;
    }
}
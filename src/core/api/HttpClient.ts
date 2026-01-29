// Definimos un contrato genérico para peticiones HTTP
export interface HttpParams {
    [key: string]: string | number | boolean;
}

export interface HttpClient {
    get<T>(url: string, params?: HttpParams): Promise<T>;
    post<T>(url: string, body: any): Promise<T>;
}

export type RequestResponseType = {
    status: number;
    data?: any;
    error?: any;
};

export type HttpVerb = 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'PATCH' | 'patch' | 'DELETE' | 'delete' | 'HEAD' | 'head' | 'OPTIONS' | 'options' | 'CONNECT' | 'connect' | 'TRACE' | 'trace';

export type GeneralResultType = any

export type MetadataType = {
    page: number;
    per_page: number;
    total: number;

} | null
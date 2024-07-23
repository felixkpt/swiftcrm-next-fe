import { v4 as uuidv4 } from 'uuid';

interface ApiConfig {
    url: (endpoint: string) => string;
}

interface Config {
    name: string;
    api: ApiConfig;
    uuid: () => string;
}

export const appConfig: Config = {
    name: 'SwiftCRM',
    api: {
        url: (endpoint: string): string => {
            endpoint = endpoint.replace(/\/+/, '/')

            const apiUrl = 'http://127.0.0.1:8000/';
            return `${apiUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
        }
    },
    uuid: () => uuidv4()
};

export const themeOption = 'dark';

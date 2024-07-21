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

type CallbackFunction = (payload: any) => void;

const subscribers: Record<string, CallbackFunction[]> = {};
let wildcardSubscribers: CallbackFunction[] = [];

export const publish = (action: string, payload: any) => {
    if (subscribers[action]) {
        subscribers[action].forEach(callback => callback(payload));
    }
    wildcardSubscribers.forEach(callback => callback({ action, ...payload }));
};

export const subscribe = (action: string, callback: CallbackFunction) => {
    if (action === '*') {
        wildcardSubscribers.push(callback);
    } else {
        if (!subscribers[action]) {
            subscribers[action] = [];
        }
        subscribers[action].push(callback);
    }

    // Return an unsubscribe function
    return () => {
        if (action === '*') {
            wildcardSubscribers = wildcardSubscribers.filter(cb => cb !== callback);
        } else {
            subscribers[action] = subscribers[action].filter(cb => cb !== callback);
        }
    };
};

export const themeOption = 'dark';

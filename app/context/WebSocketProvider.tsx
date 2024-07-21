import React, { createContext, useEffect, useState } from 'react';
import { publish } from '../components/baseComponents/utils/helpers';

interface WebSocketContextType {
    client_id: string;
    response: {
        client_id: string;
        model_id: string;
        message: string;
    } | null;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);

type WebSocketProviderProps = {
    children: React.ReactNode;
    client_id: string; // Accept client_id as a prop
};

export const WebSocketProvider = ({ children, client_id }: WebSocketProviderProps) => {

    const [response, setResponse] = useState<WebSocketContextType | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${client_id}`);

        ws.onmessage = (event) => {
            console.log('NEW MSG event:', event.data);
            try {
                const parsedMessage: WebSocketContextType = JSON.parse(event.data);
                setResponse(parsedMessage);
            } catch (err) {
                console.log('Failed to parse WebSocket data:', err);
            }
        };

        return () => {
            ws.close();
        };
    }, [client_id]);

    return (
        <WebSocketContext.Provider value={{ client_id, response }}>
            {children}
        </WebSocketContext.Provider>
    );
};

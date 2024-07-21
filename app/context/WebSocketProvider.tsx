import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const uniqueKey = uuidv4();

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${uniqueKey}`);
        
        ws.onmessage = (event) => {
            console.log("event", event);
            setMessage(event.data);
        };
        
        return () => {
            ws.close();
        };
    }, [uniqueKey]);
    
    return (
        <WebSocketContext.Provider value={message}>
            {children}
        </WebSocketContext.Provider>
    );
};

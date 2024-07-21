import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/notifications');
        
        ws.onmessage = (event) => {
            console.log("event", event)
            
            setMessage(event.data);
        };
        
        return () => {
            // ws.close();
        };
    }, []);
    
    return (
        <WebSocketContext.Provider value={message}>
            {children}
        </WebSocketContext.Provider>
    );
};

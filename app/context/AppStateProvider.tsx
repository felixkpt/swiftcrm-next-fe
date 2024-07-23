import React, { createContext, useEffect, useState, useContext } from 'react';

// Define the shape of the global state
interface EventState {
    [key: string]: {
        status: 'pending' | 'done';
        data: any;
    };
}

interface AppStateContextType {
    client_id: string;
    events: EventState;
    updateEvent: (event: string, status: 'pending' | 'done', data?: any) => void;
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Create a custom hook to use the AppStateContext
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};

type AppStateProviderProps = {
    children: React.ReactNode;
    client_id: string; // Accept client_id as a prop
};

export const AppStateProvider = ({ children, client_id }: AppStateProviderProps) => {
    const [events, setEvents] = useState<EventState>({});

    // Function to update the state of an event
    const updateEvent = (event: string, status: 'pending' | 'done', data: any = null) => {
        setEvents(prev => ({
            ...prev,
            [event]: { status, data },
        }));
    };

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${client_id}`);

        ws.onmessage = (event) => {
            console.log('NEW MSG event:', event.data);
            try {
                const parsedMessage = JSON.parse(event.data);
                const { model_id, message } = parsedMessage;
                updateEvent(`${model_id}_done`, 'done', message);
            } catch (err) {
                console.log('Failed to parse WebSocket data:', err);
            }
        };

        return () => {
            ws.close();
        };
    }, [client_id]);

    return (
        <AppStateContext.Provider value={{ client_id, events, updateEvent }}>
            {children}
        </AppStateContext.Provider>
    );
};

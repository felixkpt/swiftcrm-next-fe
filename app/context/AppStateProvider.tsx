import React, { createContext, useEffect, useState, useContext } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { formatErrors } from '../components/baseComponents/utils/formatErrors';

interface Event {
    name: string;
    status: 'pending' | 'done';
    data: any;
}

interface EventState {
    [key: string]: Event[]; // Array of events for each UUID/model ID
}
interface AppStateContextType {
    client_id: string;
    events: EventState;
    hasPendingEvents: boolean;
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
    const updateEvent = (event: string, status: 'pending' | 'done' | 'failed', data: any = null) => {
        setEvents(prev => {
            const [uuid, eventName] = event.split('_', 2);

            if (!eventName) return prev

            // Check if the event already exists
            const existingEvents = prev[uuid] || [];

            let updatedEvents: any = []
            if (status === 'done') {
                // Add the done event
                updatedEvents.push({ name: eventName, status, data });
            } else {
                // For pending or failed events
                // updatedEvents = existingEvents.filter(e => e.name !== eventName); // Remove any previous entries with the same name
                updatedEvents.push({ name: eventName, status, data });
            }

            const reslvdEvents = updatedEvents.length > 0 ? updatedEvents : existingEvents
            return { ...prev, [uuid]: reslvdEvents };


        });
    };

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${client_id}`);

        ws.onmessage = (event) => {
            try {
                const parsedMessage = JSON.parse(event.data);
                const { model_id, model_name, message } = parsedMessage;
                setTimeout(() => {
                    updateEvent(`${model_id}_done`, 'done', { message, model_name });
                }, 3000);
            } catch (err) {
                console.log('Failed to parse WebSocket data:', err);
            }
        };

        // Subscribe to *_submit events
        const unsubscribeSubmit = subscribe('*_submit', (payload: any) => {
            const { modelID } = payload;
            console.log('_submit', payload)
            updateEvent(modelID, 'pending');
        });
        // Subscribe to *_done events
        const unsubscribeDone = subscribe('*_done', (payload: any) => {
            const { modelID, ...other } = payload;
            let data = other
            if (other.status !== 200) {
                data = formatErrors.fastAPI(other.error)
            }
            updateEvent(modelID, 'failed', data);
        });

        return () => {
            ws.close();
            unsubscribeSubmit();
            unsubscribeDone();
        };
    }, [client_id]);

    // Check for any pending events
    const hasPendingEvents = Object.values(events).flat().some(event => event.status === 'pending');

    return (
        <AppStateContext.Provider value={{ client_id, events, hasPendingEvents, updateEvent }}>
            {children}
        </AppStateContext.Provider>
    );
};

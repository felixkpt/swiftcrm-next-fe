import React, { createContext, useEffect, useState, useContext } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { formatErrors } from '../components/baseComponents/utils/formatErrors';

interface Event {
    uuid: string;
    name: string;
    status: 'pending' | 'done' | 'failed';
    data: any;
}

type EventStatus = 'pending' | 'done' | 'failed';

// Array of events
type EventState = Event[];

interface AppStateContextType {
    client_id: string;
    events: EventState;
    hasPendingEvents: boolean;
    updateEvent: (event: string, status: 'pending' | 'done' | 'failed', data?: any) => void;
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
    const [events, setEvents] = useState<EventState>([]);

    // Function to update the state of an event
    const updateEvent = (event: string, status: EventStatus, data: any = null) => {
        setEvents(prev => {
            if (!event || typeof event !== 'string') {
                console.error('Invalid event:', event);
                return prev;
            }

            const [uuid, eventName] = event.split('_', 2);
            if (!eventName) return prev;

            // Add the new event to the array
            const newEvent: Event = { uuid, name: eventName, status, data };
            return [...prev, newEvent];
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

        // // Subscribe to *_submit events
        // const unsubscribeSubmit = subscribe('*_submit', (payload: any) => {
        //     const { modelID } = payload;
        //     updateEvent(modelID, 'pending');
        // });

        // Subscribe to *_done events
        const unsubscribeDone = subscribe('*_done', (payload: any) => {
            const { modelID, ...other } = payload;
            let data = other;
            let status: EventStatus = 'done'
            if (other.status !== 200) {
                data = formatErrors.fastAPI(other.error);
                status = 'failed'
            }
            updateEvent(modelID, status, data);
        });

        return () => {
            ws.close();
            // unsubscribeSubmit();
            unsubscribeDone();
        };
    }, [client_id]);

    // Check for any pending events
    const hasPendingEvents = events.some(event => event.status === 'pending');

    return (
        <AppStateContext.Provider value={{ client_id, events, hasPendingEvents, updateEvent }}>
            {children}
        </AppStateContext.Provider>
    );
};

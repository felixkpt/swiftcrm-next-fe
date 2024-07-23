import { useEffect, useState } from 'react';
import { RequestResponseType } from '../types';
import { subscribe } from '../utils/helpers';

type Props = {
    modelID: string;
};

const useAutoPostDone = ({ modelID }: Props) => {
    const [response, setResponse] = useState<RequestResponseType>();

    useEffect(() => {
        // Factory function to generate subscription handlers based on modelID
        const subscribeToDoneEvent = (eventName: string) => {
            const handleResponse = (response: RequestResponseType) => {
                setResponse(response);
            };

            return subscribe(eventName, handleResponse);
        };

        // List of event names to subscribe to
        const eventNames = [
            `${modelID}_done`,
            `${modelID}CreateOrUpdate_done`,
            `${modelID}UpdateStatus_done`,
            `${modelID}Archive_done`,
            `${modelID}Delete_done`,
        ];

        // Subscribe to all specified events
        const unsubscribeFunctions = eventNames.map((eventName) =>
            subscribeToDoneEvent(eventName)
        );

        // Clean up subscriptions
        return () => {
            unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
        };
    }, [modelID]);

    return { response };
};

export default useAutoPostDone;

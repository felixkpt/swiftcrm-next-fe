import { useEffect, useState } from 'react';
import { RequestResponseType } from '../types';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';

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
            `${modelID}_CreateOrUpdate_done`,
            `${modelID}_UpdateStatus_done`,
            `${modelID}_Archive_done`,
            `${modelID}_Delete_done`,
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

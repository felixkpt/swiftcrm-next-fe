// components/AutoPost.tsx

import React, { useEffect } from 'react';
import { subscribe, publish } from '../utils/helpers';
import { AutoResponseType, autoRequest } from '../utils/autoRequest';
import { useAppState } from '@/app/context/AppStateProvider';

type Props = {
    modelID: string;
};

const AutoPost: React.FC<Props> = ({ modelID }) => {
    const { updateEvent } = useAppState();

    useEffect(() => {
        const handleSubmit = async ({ action, method, formData }: any) => {
            updateEvent(`${modelID}_submit`, 'pending');

            try {
                const response: AutoResponseType<any> = await autoRequest(action, method, formData);

                publish(`${modelID}_done`, {
                    status: response.status,
                    data: response.data,
                    error: response.error,
                });
            } catch (error) {
                const errorMessage = (error as Error).message || 'Internal Server Error';

                publish(`${modelID}_done`, {
                    status: 500,
                    error: errorMessage,
                });
            }
        };

        const unsubscribe = subscribe(`${modelID}_submit`, handleSubmit);

        return () => {
            unsubscribe();
        };
    }, [modelID, updateEvent]);

    return null;
};

export default AutoPost;

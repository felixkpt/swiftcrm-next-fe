'use client'
import React, { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { subscribe, publish, appConfig } from '../../utils/helpers';

type Props = {
    componentId: string;
};

const AutoPost: React.FC<Props> = ({ componentId }) => {

    useEffect(() => {
        const handleSubmit = async ({ method, action, formData }: any) => {
            try {
                const url = appConfig.api.url(action);
                const response = await axios({
                    method,
                    url,
                    data: formData,
                });
                console.log('Pubs:', `${componentId}_done`)
                publish(`${componentId}_done`, { status: response.status, data: response.data });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    const errorData = axiosError.response?.data || axiosError?.message;

                    publish(`${componentId}_done`, {
                        status: axiosError.response?.status,
                        error: errorData,
                    });
                } else {
                    const internalError = (error as Error).message || 'Internal Server Error';
                    publish(`${componentId}_done`, {
                        status: 500,
                        error: internalError,
                    });
                }
            }
        };

        const unsubscribe = subscribe(`${componentId}_submit`, handleSubmit);

        return () => {
            unsubscribe();
        };
    }, [componentId]);

    return null;
};

export default AutoPost;

'use client'
import { useEffect, useState } from 'react';
import { publish, subscribe } from '../../utils/helpers';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';


type Props = {
    modelID: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string; // Change action to endpoint
    fillable: FillableType[];
};

const AutoUpdateStatus: React.FC<Props> = ({ modelID, modelNameSingular, method, endpoint, fillable }) => {
    const [localTitle, setLocalTitle] = useState(`Update Status of ${modelNameSingular}`)
    const [record, setRecord] = useState<any>();
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (record) {
            setLocalTitle(`Update Status of ${modelNameSingular} #${record.id}`)
        } else {
            setLocalTitle(`Update Status of ${modelNameSingular}`)
        }
    }, [record])

    useEffect(() => {
        const handleRecord = ({ record }: { record: Record<string, string>; }) => {
            setRecord(record)
            console.log('AutoUpdateStatus:', method)
        };

        const unsubscribe = subscribe(`${modelID}_setRecord`, handleRecord);

        return () => {
            unsubscribe();
        };
    }, [modelID, method, endpoint, fillable]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        publish(`${modelID}_submit`, { method: 'put', action: endpoint + '/' + record.id });
    };

    useEffect(() => {
        const handleResponse = ({ status, error }: any) => {
            setLoading(false);
            if (status !== 200) {
                setResponseMessage('Error updating record');
            }
        };

        const unsubscribe = subscribe(`${modelID}_done`, handleResponse);

        return () => {
            unsubscribe();
        };
    }, [modelID, method, endpoint, fillable]);

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5">
                <h3 className="font-bold text-lg text-gray-300">{localTitle}</h3>
            </div>
            <form data-action={endpoint} method="post" onSubmit={handleSubmit}>
                <div className={`${modelID}ResponseSection my-3`}>
                    {responseMessage && (
                        <div className="p-3 rounded bg-red-200 text-red-800">
                            {responseMessage}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!record || loading}
                    >
                        {loading ? 'Updating status...' : 'Update status'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AutoUpdateStatus;

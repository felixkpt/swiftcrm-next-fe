'use client'
import { useEffect, useState } from 'react';
import { appConfig, subscribe } from '../../utils/helpers';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';
import axios from 'axios';

type Props = {
    componentId: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string; // Change action to endpoint
    fillable: FillableType[];
};

const AutoDeleteRecord: React.FC<Props> = ({ componentId, modelNameSingular, method, endpoint, fillable }) => {
    const [localTitle, setLocalTitle] = useState(`Delete ${modelNameSingular} record`)
    const [record, setRecord] = useState<any>();

    useEffect(() => {
        if (record) {
            setLocalTitle(`Delete ${modelNameSingular} record #${record.id}`)
        } else {
            setLocalTitle(`Delete ${modelNameSingular} record`)
        }
    }, [record])

    useEffect(() => {
        const handleRecord = ({ record }: { record: Record<string, string>; }) => {
            setRecord(record)
            console.log('AutoDeleteRecord:', method)
        };

        const unsubscribe = subscribe(`${componentId}_setRecord`, handleRecord);

        return () => {
            unsubscribe();
        };
    }, [componentId, method, endpoint, fillable]);

    const handleDelete = async () => {
        if (!record) return;

        try {
            const response = await axios.delete(appConfig.api.url(endpoint + '/11' + record.id), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setRecord(null);
                alert(`${modelNameSingular} record deleted successfully.`);
            } else {
                alert(`Failed to delete ${modelNameSingular} record.`);
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert(`Error deleting ${modelNameSingular} record.`);
        }
    };

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5"><h3 className="font-bold text-lg text-gray-300">{localTitle}</h3></div>
            <div className="flex justify-end">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDelete}
                    disabled={!record}
                >
                    Delete
                </button>
            </div>
        </>
    );
};

export default AutoDeleteRecord;

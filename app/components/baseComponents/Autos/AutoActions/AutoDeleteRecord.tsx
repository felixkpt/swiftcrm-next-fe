'use client'
import { useEffect, useState } from 'react';
import { subscribe } from '../../utils/helpers';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';


type ErrorResponse = {
    detail: { loc: string[]; msg: string; type: string }[];
};

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

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5"><h3 className="font-bold text-lg text-gray-300">{localTitle}</h3></div>

            Record Delete!
        </>
    );
};

export default AutoDeleteRecord;

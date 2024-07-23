'use client'
import { useEffect, useState } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';


type ErrorResponse = {
    detail: { loc: string[]; msg: string; type: string }[];
};

type Props = {
    modelID: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string; // Change action to endpoint
    fillable: FillableType[];
};

const AutoArchiveRecord: React.FC<Props> = ({ modelID, modelNameSingular, method, endpoint, fillable }) => {
    const [localTitle, setLocalTitle] = useState(`Archive ${modelNameSingular} record`)
    const [record, setRecord] = useState<any>();

    useEffect(() => {
        if (record) {
            setLocalTitle(`Archive ${modelNameSingular} record #${record.id}`)
        } else {
            setLocalTitle(`Archive ${modelNameSingular} record`)
        }
    }, [record])

    useEffect(() => {
        const handleRecord = ({ record }: { record: Record<string, string>; }) => {
            setRecord(record)
            console.log('AutoArchiveRocord:', method)
        };

        const unsubscribe = subscribe(`${modelID}_setRecord`, handleRecord);

        return () => {
            unsubscribe();
        };
    }, [modelID, method, endpoint, fillable]);

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5"><h3 className="font-bold text-lg text-gray-300">{localTitle}</h3></div>

            Archiving...
        </>
    );
};

export default AutoArchiveRecord;

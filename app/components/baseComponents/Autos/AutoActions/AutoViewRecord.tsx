'use client'
import { useEffect, useState } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType, HeaderType } from '../BaseAutoModel/types';
import AutoTableSingle from '../AutoTableSingle';


type Props = {
    modelID: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string; // Change action to endpoint
    fillable: FillableType[];
};

const AutoViewRecord: React.FC<Props> = ({ modelID, modelNameSingular, method, endpoint, fillable }) => {
    const [localTitle, setLocalTitle] = useState(`Viewing ${modelNameSingular}`)
    const [record, setRecord] = useState<any>();
    const [headers, setHeaders] = useState<any>();

    useEffect(() => {
        if (record) {
            setLocalTitle(`Viewing ${modelNameSingular} #${record.id}`)
        } else {
            setLocalTitle(`Viewing ${modelNameSingular}`)
        }
    }, [record])

    useEffect(() => {
        const handleRecord = ({ record, headers }: { record: Record<string, string>; headers: HeaderType[] }) => {
            setRecord(record)
            setHeaders(headers)
            console.log('handleRecord:', method)
        };

        const unsubscribe = subscribe(`${modelID}_setRecord`, handleRecord);

        return () => {
            unsubscribe();
        };
    }, [modelID, method, endpoint, fillable]);

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5"><h3 className="font-bold text-lg text-gray-300">{localTitle}</h3></div>
            <AutoTableSingle
                record={record}
                headers={headers}
                modelID={modelID}
                isFromAutoView={true}
            />
        </>
    );
};

export default AutoViewRecord;

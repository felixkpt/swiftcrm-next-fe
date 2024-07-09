'use client'

import Pagination from "../Pagination/Index";
import { HeaderType } from "./BaseAutoModel/types";
import { ResultsType, MetadataType } from "@/app/(pages)/conversation-app/ConversationModel/types";

type Props = {
    headers: HeaderType[];
    records: ResultsType
    metadata: MetadataType
    componentId: string
    onPageChange: (page: number) => void;
    AutoTableHeaderActions?: React.ElementType
};

const AutoTable = ({ records, metadata, headers, componentId, onPageChange, AutoTableHeaderActions }: Props) => {

    const currentPage = metadata?.page
    const perPage = metadata?.per_page
    const totalPages = metadata?.total

    componentId = componentId + 'AutoTable'

    return (
        <div className="autotableWrapper" id={componentId}>
            {AutoTableHeaderActions
                &&
                <AutoTableHeaderActions componentId={componentId} records={records} />
            }
            <table className="table shadow">
                <thead>
                    <tr>
                        {headers.map((column, index) => (
                            <th key={index} className={`${componentId} heading-${column.key}`}>{column.label || column.key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((column, colIndex) => (
                                <td key={colIndex} className={`${componentId} data-${column.key}`}>{record[column.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-2">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default AutoTable;

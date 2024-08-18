'use client'

import Pagination from "../Pagination/Paginate";
import { GeneralResultType, MetadataType } from "../types";
import { FillableType, HeaderType } from "./BaseAutoModel/types";
type Props = {
    headers: HeaderType[];
    records: GeneralResultType[]
    fillableFields: FillableType[];
    modelID: string
    apiEndpoint: string
    metadata: MetadataType
    onPageNumberChange: (page: number) => void;
    AutoTableHeaderActions?: React.ElementType
    handleSearch: (filters: Record<string, any>) => void;
    handleExport: (filters: Record<string, any>) => void;
};

const AutoTable = ({ headers, records, fillableFields, apiEndpoint, modelID, metadata, onPageNumberChange, AutoTableHeaderActions, handleSearch, handleExport }: Props) => {

    const currentPage = metadata?.page
    const perPage = metadata?.per_page || 10
    const totalRecords = metadata?.total_records

    modelID = modelID + 'AutoTable'

    return (
        <div className="autotableWrapper border border-base-200 rounded-md shadow-md py-1" id={modelID}>
            {AutoTableHeaderActions
                &&
                <AutoTableHeaderActions headers={headers} fillableFields={fillableFields} modelID={modelID} metadata={metadata} handleSearch={handleSearch} handleExport={handleExport} />
            }
            <table className="table shadow">
                <thead>
                    <tr>
                        {headers.map((column, index) => (
                            <th key={index} className={`${modelID} heading-${column.key}`}>{column.label || column.key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((column, colIndex) => (
                                <td key={colIndex} className={`${modelID} data-${column.key}`}>{record[column.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-2">
                <Pagination currentPage={currentPage} perPage={perPage} totalRecords={totalRecords} onPageNumberChange={onPageNumberChange} />
            </div>
        </div>
    );
};

export default AutoTable;

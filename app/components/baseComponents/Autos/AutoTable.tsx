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

const AutoTable = ({ headers, records, fillableFields, modelID, metadata, onPageNumberChange, AutoTableHeaderActions, handleSearch, handleExport }: Props) => {

    const currentPage = metadata?.page
    const perPage = metadata?.per_page || 10
    const totalRecords = metadata?.total_records || 0

    const modelIDLocal = modelID + '_AutoTable'

    return (
        <div className="border rounded-md shadow-md py-1 min-h-[500px] w-full overflow-auto" id={modelIDLocal}>
            {AutoTableHeaderActions
                &&
                <AutoTableHeaderActions headers={headers} fillableFields={fillableFields} modelID={modelID} metadata={metadata} handleSearch={handleSearch} handleExport={handleExport} />
            }
            <div className="w-full overflow-auto">
                <table className="table shadow">
                    <thead>
                        <tr>
                            {headers.map((column, index) => (
                                <th key={index} className={`${modelIDLocal} heading-${column.key}`}>{column.label || column.key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((column, colIndex) => (
                                    <td key={colIndex} className={`${modelIDLocal} data-${column.key}`}>{record[column.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-2">
                <Pagination currentPage={currentPage} perPage={perPage} totalRecords={totalRecords} onPageNumberChange={onPageNumberChange} />
            </div>
        </div>
    );
};

export default AutoTable;

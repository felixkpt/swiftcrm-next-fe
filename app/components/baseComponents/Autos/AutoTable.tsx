import React, { useState } from 'react';
import { GeneralResultType, MetadataType } from "../types";
import { FillableType, HeaderType } from "./BaseAutoModel/types";
import EnhancedTable from './EnhancedTable'; // Import your EnhancedTable component
import { IconButton, Tooltip, Collapse, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

type Props = {
    headers: HeaderType[];
    records: GeneralResultType[];
    fillableFields: FillableType[];
    modelID: string;
    apiEndpoint: string;
    metadata: MetadataType;
    onPageNumberChange: (page: number) => void;
    AutoTableHeaderActions?: React.ElementType;
    handleSearch: (filters: Record<string, any>) => void;
    handleExport: (filters: Record<string, any>) => void;
};

const AutoTable = ({ headers, records, fillableFields, modelID, metadata, onPageNumberChange, AutoTableHeaderActions, handleSearch, handleExport }: Props) => {
    const [orderBy, setOrderBy] = useState('id'); // Default sorting column
    const [order, setOrder] = useState<'asc' | 'desc'>('desc'); // Default sorting order
    const [filtersVisible, setFiltersVisible] = useState(false); // State to manage filter visibility

    const currentPage = metadata?.page || 0;
    const perPage = metadata?.per_page || 10;
    const totalRecords = metadata?.total_records || 0;

    const headCells = headers.map(header => ({
        id: header.key,
        numeric: header.numeric || false,
        disablePadding: header.disablePadding || false,
        label: header.label || header.key,
    }));

    const rows = records.map(record => ({
        id: record.id,
        ...record,
    }));

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const toggleFiltersVisibility = () => {
        setFiltersVisible(!filtersVisible);
    };

    modelID = modelID + 'AutoTable'

    return (
        <Box sx={{ width: '100%', overflow: 'auto', border: 1, borderRadius: 2, borderColor: 'grey.500', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', }} id={modelID}>
            {/* Tooltip button to toggle filters visibility */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Tooltip title="Filter list">
                    <IconButton onClick={toggleFiltersVisibility} color="primary">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Collapse filters section */}
            <Collapse in={filtersVisible}>
                {AutoTableHeaderActions && (
                    <AutoTableHeaderActions
                        headers={headers}
                        fillableFields={fillableFields}
                        modelID={modelID}
                        metadata={metadata}
                        handleSearch={handleSearch}
                        handleExport={handleExport}
                    />
                )}
            </Collapse>

            <EnhancedTable
                headCells={headCells}
                rows={rows}
                orderBy={orderBy}
                order={order}
                onRequestSort={handleRequestSort}
                onPageNumberChange={onPageNumberChange}
                rowsPerPage={perPage}
                currentPage={currentPage}
                totalRecords={totalRecords}
            />
        </Box>
    );
};

export default AutoTable;

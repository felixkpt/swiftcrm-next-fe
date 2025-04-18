'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { publish } from '@/app/components/baseComponents/utils/pubSub';
import { TextField, FormControl, Button, Grid, Typography } from '@mui/material';
import DropdownDependsOn from '../../Autos/AutoActions/Dropdowns/DropdownDependsOn';
import DynamicDropdown from '../../Autos/AutoActions/Dropdowns/DynamicDropdown';
import { FillableType } from '../../Autos/BaseAutoModel/types';
import { MetadataType, ServerModelOptionType } from '../../types';
import { useSearchParams } from 'next/navigation';

type Props = {
  fillableFields: FillableType[];
  modelID: string;
  metadata: MetadataType;
  handleSearch: (filters: Record<string, any>) => void;
  handleExport: (filters: Record<string, any>) => void;
  serverModelOptions: ServerModelOptionType;
};

// Component for rendering table header actions including filters and buttons
const AutoTableHeaderActions: React.FC<Props> = ({ fillableFields, modelID, metadata, handleSearch, handleExport, serverModelOptions }) => {
  // State for managing filter values and record data
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [key, setKey] = useState<number>(0);
  const [record, setRecord] = useState<Record<string, any> | null>(null);

  // Hook for accessing search params from the URL
  const params = useSearchParams();

  // Effect to initialize filters based on URL parameters
  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    let paramsFound = false; // Flag to track if any params were found

    fillableFields.forEach((field) => {
      const value = params.get(field.name);
      if (value !== null) {
        initialFilters[field.name] = value;
        paramsFound = true; // Set flag if a parameter is found
      }
    });

    setFilters(initialFilters);
    setRecord(initialFilters);
    setKey(prevKey => prevKey + 1);

    // Delay execution of search to ensure filters are set
    setTimeout(() => {
      if (paramsFound) {
        handleSearch(initialFilters); // Use the initialFilters
      }
    }, 200);

  }, [params, fillableFields]);

  // Handle input changes and update dependent fields
  const handleInputChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name as string]: value,
    }));

    const field = fillableFields.find(f => f.name === name);
    if (field?.onChangeUpdateList) {
      field.onChangeUpdateList.forEach(updateField => {
        console.log(`${modelID}_update_${updateField}`, value);
        publish(`${modelID}_update_${updateField}`, { [field.name]: value });
      });
    }
  };

  return (
    <div style={{ padding: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="body2" align="right">
            {metadata?.total_records !== undefined && metadata.total_records >= 0
              ? `${metadata.total_records} records`
              : ''}
          </Typography>
        </Grid>
        <Grid container item spacing={1} alignItems={'center'}>
          {key > 0 && fillableFields
            .filter(field => field.type === 'input' || field.type === 'dropdown')
            .map((field) => {
              if (!field.isVisibleInList) return null;

              return (
                <Grid item key={field.name} xs={12} md={6} lg={4}>
                  {/* Render input fields */}
                  {field.type === 'input' && (
                    <FormControl fullWidth margin="dense">
                      <TextField
                        label={field.label || field.name}
                        name={field.name}
                        value={filters[field.name] || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                      />
                    </FormControl>
                  )}
                  {/* Render dropdown fields with dependencies */}
                  {field.type === 'dropdown' && field.dropdownDependsOn ? (
                    <FormControl fullWidth margin="dense">
                      <DropdownDependsOn
                        modelID={modelID}
                        name={field.name}
                        value={filters[field.name] || ''}
                        onChange={handleInputChange}
                        dropdownSource={field.dropdownSource || ''}
                        dropdownDependsOn={field.dropdownDependsOn}
                        size='small'
                        record={record}
                      />
                    </FormControl>
                  ) : field.type === 'dropdown' ? (
                    <FormControl fullWidth margin="dense">
                      <DynamicDropdown
                        modelID={modelID}
                        name={field.name}
                        serverModelOptions={serverModelOptions}
                        value={filters[field.name] || ''}
                        onChange={handleInputChange}
                        dropdownSource={field.dropdownSource || ''}
                        size='small'
                        record={record}
                      />
                    </FormControl>
                  ) : null}
                </Grid>
              );
            })}

          {/* Action buttons for search and export */}
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSearch(filters)}
                  size="small"
                >
                  Search
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => handleExport(filters)}
                  size="small"
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AutoTableHeaderActions;

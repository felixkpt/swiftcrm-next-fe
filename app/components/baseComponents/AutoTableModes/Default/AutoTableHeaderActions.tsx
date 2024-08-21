'use client';
import React, { useState, ChangeEvent } from 'react';
import { publish } from '@/app/components/baseComponents/utils/pubSub';
import { TextField, FormControl, Button, Grid, Typography } from '@mui/material';
import DropdownDependsOn from '../../Autos/AutoActions/DropdownDependsOn';
import DynamicDropdown from '../../Autos/AutoActions/DynamicDropdown';
import { FillableType } from '../../Autos/BaseAutoModel/types';
import { MetadataType } from '../../types';

type Props = {
  fillableFields: FillableType[];
  modelID: string;
  metadata: MetadataType;
  handleSearch: (filters: Record<string, any>) => void;
  handleExport: (filters: Record<string, any>) => void;
  fetchOptions: (endPoint: string, params: object) => Promise<any[]>;

};

const AutoTableHeaderActions: React.FC<Props> = ({ fillableFields, modelID, metadata, handleSearch, handleExport,fetchOptions }) => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleInputChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name as string]: value,
    }));

    // Check if the field has onChangeUpdateList
    const field = fillableFields.find((f) => f.name === name);
    if (field?.onChangeUpdateList) {
      field.onChangeUpdateList.forEach((updateField) => {
        console.log(`${modelID}_update_${updateField}`, value);
        publish(`${modelID}_update_${updateField}`, { [field.name]: value });
      });
    }
  };

  return (
    <div style={{ padding: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          {/* records metadata */}
          <Typography variant="body2" align="right">
            {metadata?.total_records !== undefined && metadata.total_records >= 0
              ? `${metadata.total_records} records`
              : ''}
          </Typography>
        </Grid>
        <Grid container item spacing={1} alignItems={'center'}>
          {fillableFields
            .filter(field => field.type === 'input' || field.type === 'dropdown')
            .map((field) => (
              field.isVisibleInList && (
                <Grid item key={field.name} xs={12} md={6} lg={4}>
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
                  {field.type === 'dropdown' && field.dropdownDependsOn ? (
                    <FormControl fullWidth margin="dense">
                      <DropdownDependsOn
                        modelID={modelID}
                        name={field.name}
                        fetchOptions={fetchOptions}
                        value={filters[field.name] || ''}
                        onChange={handleInputChange}
                        dropdownSource={field.dropdownSource || ''}
                        dropdownDependsOn={field.dropdownDependsOn}
                        size='small'
                      />
                    </FormControl>
                  ) : field.type === 'dropdown' ? (
                    <FormControl fullWidth margin="dense">
                      <DynamicDropdown
                        modelID={modelID}
                        name={field.name}
                        fetchOptions={fetchOptions}
                        value={filters[field.name] || ''}
                        onChange={handleInputChange}
                        dropdownSource={field.dropdownSource || ''}
                        size='small'
                      />
                    </FormControl>
                  ) : null}
                </Grid>
              )
            ))}

          {/* Action buttons */}
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

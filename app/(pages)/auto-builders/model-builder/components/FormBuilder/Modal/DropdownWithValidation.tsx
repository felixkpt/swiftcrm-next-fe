import React from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';
import { RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';

interface DropdownWithValidationProps {
    dropdownSource: string;
    handleSourceChange: (event: SelectChangeEvent<string>) => void;
    dropdownDependencies: string[];
    handleDependencyChange: (event: SelectChangeEvent<string[]>) => void;
    dropdownSourcesList: RecordType[];
    dropdownSourceError?: boolean;
}

const DropdownWithValidation: React.FC<DropdownWithValidationProps> = ({
    dropdownSource,
    handleSourceChange,
    dropdownDependencies,
    handleDependencyChange,
    dropdownSourcesList,
    dropdownSourceError,
}) => {

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Data source
                </Typography>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Source</InputLabel>
                    <Select
                        value={dropdownSource}
                        onChange={handleSourceChange}
                        label="Source"
                        error={dropdownSourceError}
                        renderValue={(selected) => selected}
                    >
                        {dropdownSourcesList.map((dep, idx) => (
                            <MenuItem key={idx} value={dep.apiEndpoint}>
                                {dep.apiEndpoint}
                            </MenuItem>
                        ))}
                    </Select>
                    {dropdownSourceError && (
                        <Typography variant="caption" color="error">
                            Data source is required
                        </Typography>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Depends On
                </Typography>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Dependencies</InputLabel>
                    <Select
                        multiple
                        value={dropdownDependencies}
                        onChange={handleDependencyChange}
                        label="Dependencies"
                        renderValue={(selected) => (selected as string[]).join(', ')}
                    >
                        {dropdownSourcesList
                            .filter((dep) => dep.apiEndpoint !== dropdownSource)
                            .map((dep, idx) => (
                                <MenuItem key={idx} value={dep.apiEndpoint}>
                                    {dep.apiEndpoint}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
};

export default DropdownWithValidation;

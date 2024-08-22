import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ServerModelOptionType } from '../../types';

type Props = {
    modelID: string;
    name: string;
    serverModelOptions: ServerModelOptionType;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    record?: Record<string, any> | null;
    size?: 'small' | 'medium';
};

const DynamicDropdown: React.FC<Props> = ({
    name,
    serverModelOptions,
    value,
    onChange,
    dropdownSource,
    record,
    size = 'medium',
}) => {
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        console.log('dropdownSource:',dropdownSource, 'serverModelOptions:',serverModelOptions)
        const exists = serverModelOptions[dropdownSource]
        console.log('Exists:', exists)
        if (exists) {
            setOptions(exists.records || [])
        }
    }, [dropdownSource]);

    useEffect(() => {
        if (record && value) {
            const exists = options.find((itm) => itm.id === record.id);
            if (exists) {
                onChange({ target: { name, value: exists.id } as React.ChangeEvent<{ value: unknown }> });
            }
        }
    }, [record, options, name, value, onChange]);

    return (
        <FormControl fullWidth variant="outlined" size={size} margin="normal">
            <InputLabel htmlFor={name}>Select...</InputLabel>
            <Select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                label="Select..."
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
                <MenuItem value=""><em>Select...</em></MenuItem>
            </Select>
        </FormControl>
    );
};

export default DynamicDropdown;

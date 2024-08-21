import React, { useState, useEffect } from 'react';
import { appConfig } from '../../utils/helpers';
import { Select, MenuItem, CircularProgress, FormControl, InputLabel, FormHelperText } from '@mui/material';

type Props = {
    modelID: string;
    name: string;
    fetchOptions: (endPoint: string, params: object) => Promise<any[]>;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    record?: Record<string, any> | null;
    size?: 'small' | 'medium';
};

const DynamicDropdown: React.FC<Props> = ({
    name,
    fetchOptions,
    value,
    onChange,
    dropdownSource,
    record,
    size = 'medium',
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // Updated fetch function to use fetchOptions prop
    const fetchOptionsData = async () => {
        const queryParams = { per_page: '50' };
        setLoading(true);
        try {
            const data = await fetchOptions(appConfig.api.url(dropdownSource), queryParams);
            setOptions(data || []);
        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching options.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptionsData();
    }, [dropdownSource]);

    useEffect(() => {
        if (record && value) {
            const exists = options.find((itm) => itm.id === record.id);
            if (exists) {
                onChange({ target: { name, value: exists.id } as React.ChangeEvent<{ value: unknown }> });
            }
        }
    }, [record, options, name, value, onChange]);

    if (loading) return <CircularProgress size={24} />;
    if (error) return <FormHelperText error>{error}</FormHelperText>;

    return (
        <FormControl fullWidth variant="outlined" size={size} margin="normal">
            <InputLabel htmlFor={name}>Select...</InputLabel>
            <Select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                label="Select..."
                disabled={loading}
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

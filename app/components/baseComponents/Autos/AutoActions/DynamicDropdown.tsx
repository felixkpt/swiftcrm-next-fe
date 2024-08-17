import React, { useState, useEffect } from 'react';
import { appConfig } from '../../utils/helpers';
import { Select, MenuItem, CircularProgress, FormControl, InputLabel, FormHelperText } from '@mui/material';

type Props = {
    modelID: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    record?: Record<string, any> | null;
    size?: 'small' | 'medium';
};

const DynamicDropdown: React.FC<Props> = ({
    name,
    value,
    onChange,
    dropdownSource,
    record,
    size = 'medium',
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${appConfig.api.url(dropdownSource)}/?per_page=50`);

                if (!response.ok) throw new Error('Failed to fetch options');
                const data = await response.json();

                setOptions(data.records || []);
            } catch (error: any) {
                setError(error.message || 'An error occurred while fetching options.');
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
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

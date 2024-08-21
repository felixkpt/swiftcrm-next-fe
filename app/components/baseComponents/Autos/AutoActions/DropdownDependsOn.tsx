import React, { useState, useEffect } from 'react';
import { appConfig } from '../../utils/helpers';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { Select, MenuItem, CircularProgress, FormControl, InputLabel, FormHelperText, InputProps } from '@mui/material';

type Props = {
    modelID: string;
    name: string;
    fetchOptions: (endPoint: string, params: object) => Promise<any[]>;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    dropdownDependsOn: string[] | null;
    size?: 'small' | 'medium';
};

const DropdownDependsOn: React.FC<Props> = ({
    modelID,
    name,
    fetchOptions,
    value,
    onChange,
    dropdownSource,
    dropdownDependsOn,
    size = 'medium',
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDependencies, setCurrentDependencies] = useState<Record<string, string>>({});

    // Updated fetch function to use fetchOptions prop
    const fetchOptionsData = async (params: Record<string, string>) => {
        const queryParams = { per_page: '50', ...params };
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

    const dependenciesHandler = (newValue: Record<string, string>) => {
        const newDependencies = { ...currentDependencies, ...newValue };
        setCurrentDependencies(newDependencies);
    };

    useEffect(() => {
        if (dropdownDependsOn) {
            const listeners = dropdownDependsOn.map(dep => {
                const listenerId = `${modelID}_update_${dep}`;
                const unsubscribe = subscribe(listenerId, dependenciesHandler);
                return unsubscribe;
            });

            return () => {
                listeners.forEach(unsub => unsub());
            };
        }
    }, [modelID, dropdownSource, dropdownDependsOn]);

    useEffect(() => {
        if (Object.keys(currentDependencies).length > 0) {
            fetchOptionsData(currentDependencies);
        }
    }, [currentDependencies]);

    if (error) return <FormHelperText error>{error}</FormHelperText>;

    return (
        <FormControl fullWidth variant="outlined" margin="normal" size={size}>
            <InputLabel htmlFor={name}>Select...</InputLabel>
            <Select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                label="Select..."
                disabled={loading}
                size={size}
            >
                {loading ? (
                    <MenuItem disabled>
                        <CircularProgress size={24} />
                    </MenuItem>
                ) : (
                    options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))
                )}
                <MenuItem value=""><em>Select...</em></MenuItem>
            </Select>
        </FormControl>
    );
};

export default DropdownDependsOn;

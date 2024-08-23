import React, { useState, useEffect, useCallback, useRef } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { Autocomplete, TextField, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import fetchOptions from '../../utils/fetchOptions';

type Props = {
    modelID: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    dropdownDependsOn: string[] | null;
    size?: 'small' | 'medium';
};

// Throttling function
const throttle = (func: Function, limit: number) => {
    let lastFunc: NodeJS.Timeout | null;
    let lastRan: number | null = null;
    return (...args: any[]) => {
        if (lastFunc) clearTimeout(lastFunc);
        const now = Date.now();
        if (lastRan === null || now - lastRan >= limit) {
            func(...args);
            lastRan = now;
        } else {
            lastFunc = setTimeout(() => {
                func(...args);
                lastRan = now;
            }, limit - (now - lastRan));
        }
    };
};

const DropdownDependsOn: React.FC<Props> = ({
    modelID,
    name,
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
    const dependenciesRef = useRef(currentDependencies);

    console.log('dropdownDependsOn::', dropdownDependsOn)
    // Function to fetch options based on current dependencies
    const prepareFetchOptions = async (params: Record<string, string>) => {
        console.log('init params:', params)
        setLoading(true);
        try {
            const queryParams = { ...params, per_page: 50 };
            const data = await fetchOptions(dropdownSource, queryParams);
            setOptions(data.records || []);
        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching options.');
        } finally {
            setLoading(false);
        }
    };

    const dependenciesHandler = (newValue: Record<string, string>) => {
        // Update dependencies based on newValue
        const newDependencies = { ...currentDependencies, ...newValue };
        setCurrentDependencies(newDependencies);
    };

    // Effect to set up listeners and fetch options based on dependencies
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
            prepareFetchOptions(currentDependencies);
        }
        dependenciesRef.current = currentDependencies;

    }, [currentDependencies]);

    // Handle change function for Autocomplete
    const handleChange = (event: React.ChangeEvent<{}>, newValue: any | null) => {
        const value = newValue ? newValue.id : '';
        const changeEvent = {
            target: {
                name,
                value,
            }
        } as unknown as React.ChangeEvent<{ value: unknown }>;
        onChange(changeEvent);
    };

    // Throttled input change handler
    const fetchOptionsThrottled = useCallback(
        throttle(async (searchTerm: string) => {
            setLoading(true);
            try {
                const data = await fetchOptions(dropdownSource, { ...dependenciesRef.current, search: searchTerm });
                setOptions(data.records || []);
            } catch (error: any) {
                setError(error.message || 'An error occurred while fetching options.');
            } finally {
                setLoading(false);
            }
        }, 300), // Throttle requests to every 300ms
        [dropdownSource]
    );

    // Handle input change event for Autocomplete
    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        fetchOptionsThrottled(newInputValue);
    };

    if (error) return <FormHelperText error>{error}</FormHelperText>;

    return (
        <FormControl fullWidth variant="outlined" margin="normal" size={size}>
            <Autocomplete
                id={name}
                options={options}
                getOptionLabel={(option) => option.name || ''}
                value={options.find((option) => option.id === value) || null}
                onChange={handleChange}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select..."
                        variant="outlined"
                    />
                )}
                filterOptions={(x) => x}
            />
        </FormControl>
    );
};

export default DropdownDependsOn;

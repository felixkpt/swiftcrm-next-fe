import React, { useState, useEffect, useCallback, useRef } from 'react';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { Autocomplete, TextField, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import fetchOptions from '../../../utils/fetchOptions';
import throttle from '../../../utils/throttle';

type Props = {
    modelID: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    dropdownDependsOn: string[] | null;
    size?: 'small' | 'medium';
    record?: Record<string, any> | null;
};

const DropdownDependsOn: React.FC<Props> = ({
    modelID,
    name,
    value,
    onChange,
    dropdownSource,
    dropdownDependsOn,
    size = 'medium',
    record,
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDependencies, setCurrentDependencies] = useState<Record<string, string>>({});
    const dependenciesRef = useRef(currentDependencies);

    useEffect(() => {
        const selected = options.find((option) => option.id === value) || null;
        setSelectedOption(selected);
    }, []);

    // Function to fetch options based on current dependencies
    const prepareFetchOptions = async (params: Record<string, string>) => {
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
    function handleChange(e: React.ChangeEvent<{}>, newValue: any) {
        if (newValue) {
            const event = {
                target: {
                    name,
                    value: newValue.id,
                }
            } as unknown as React.ChangeEvent<{ value: unknown }>;

            onChange(event);
        } else {
            onChange(e as React.ChangeEvent<{ value: unknown }>);
        }
    }

    useEffect(() => {
        if (dependenciesRef.current) {
            ensureCurrentRecordIsSelected()
        }
    }, [record, dependenciesRef.current]);

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
        if (event && event.isTrusted) {
            const inputExistsInOptions = options.some(option => option.name === newInputValue);
            if (newInputValue.trim() !== '' && !inputExistsInOptions) {
                fetchOptionsThrottled(newInputValue);
            }
        }
    };

    async function ensureCurrentRecordIsSelected() {
        if (record && value) {
            const exists = options.find((itm) => itm.id === record.id);
            if (exists) {
                setSelectedOption(exists)
                onChange({ target: { name, value: exists.id } } as unknown as React.ChangeEvent<{ value: unknown }>);
            } else {
                setLoading(true);
                try {
                    const data = await fetchOptions(dropdownSource, { ...dependenciesRef.current, id: record[name] });
                    const records = data.records || []
                    // prepend fetched records to the current options
                    setOptions([...records, ...options]);
                    const current = records.find((itm: any) => itm.id == record[name])
                    if (current) {
                        setSelectedOption(current)
                        onChange({ target: { name, value: exists.id } } as unknown as React.ChangeEvent<{ value: unknown }>);
                    }

                } catch (error: any) {
                    // Handle error
                }
                setLoading(false);
            }
        }
    }

    if (error) return <FormHelperText error>{error}</FormHelperText>;

    return (
        <FormControl fullWidth variant="outlined" margin="normal" size={size}>
            <Autocomplete
                id={name}
                options={options}
                getOptionLabel={(option) => option.name || ''}
                value={selectedOption}
                onChange={handleChange}
                onInputChange={handleInputChange}
                filterOptions={(x) => x}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select..."
                        variant="outlined"
                    />
                )}
            />
        </FormControl>
    );
};

export default DropdownDependsOn;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Autocomplete, TextField, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import fetchOptions from '../../../utils/fetchOptions';
import throttle from '../../../utils/throttle';
import { formatEvent } from './helpers';
import useDropdownDependenciesListeners from './useDropdownDependenciesListener';

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
    const [selectedOption, setSelectedOption] = useState<any>(options.find((option) => option.id === value) || null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dependenciesRef = useRef<Record<string, string>>({});

    useEffect(() => {
        if (Object.keys(dependenciesRef.current).length > 0) {
            setInitialRecords();
        }
    }, [dependenciesRef.current]);

    // Function to fetch options based on current dependencies
    const setInitialRecords = async () => {
        setLoading(true);
        try {
            const queryParams = { ...dependenciesRef.current, per_page: 50 };
            const data = await fetchOptions(dropdownSource, queryParams);
            const records = data.records || []
            // prepend fetched records to the current options
            setOptions([...records]);
            if (selectedOption) {
                const current = records.find((itm: any) => itm.id == selectedOption.id)
                if (current) {
                    setSelectedOption(current)
                    onChange(formatEvent(name, current));
                } else {
                    setSelectedOption(null)
                }
            }

        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching options.');
        } finally {
            setLoading(false);
        }
    };

    const dependenciesHandler = (newValue: Record<string, string>) => {
        // Update dependencies based on newValue
        const newDependencies = { ...dependenciesRef.current, ...newValue };
        dependenciesRef.current = newDependencies
    };

    // Use the custom hook to set up listeners and fetch options based on dependencies
    useDropdownDependenciesListeners(modelID, dropdownSource, dropdownDependsOn, dependenciesHandler);

    // Handle change function for Autocomplete
    function handleChange(e: React.ChangeEvent<{}>, newValue: any) {
        setSelectedOption(newValue)
        if (newValue) {
            onChange(formatEvent(name, newValue));
        }
    }

    useEffect(() => {
        ensureCurrentRecordIsSelected()
    }, [record]);

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
                console.log('A')
                setSelectedOption(exists)
                onChange(formatEvent(name, exists));
            } else {
                console.log('B')
                setLoading(true);
                try {
                    const data = await fetchOptions(dropdownSource, { ...dependenciesRef.current, id: record[name] });
                    const records = data.records || []
                    // prepend fetched records to the current options
                    setOptions([...records, ...options]);
                    const current = records.find((itm: any) => itm.id == record[name])
                    if (current) {
                        setSelectedOption(current)
                        onChange(formatEvent(name, current));
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

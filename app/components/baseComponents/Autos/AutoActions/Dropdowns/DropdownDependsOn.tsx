import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Autocomplete, TextField, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import fetchOptions from '../../../utils/fetchOptions';
import throttle from '../../../utils/throttle';
import { formatEvent } from './helpers';
import useDropdownDependenciesListeners from './useDropdownDependenciesListener';

type Props = {
    modelID: string;
    name: string;
    value: string | undefined;
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
    const ensuredRecord = useRef<string | undefined>();
    const timeoutRef = useRef<number | null>(null); // Ref to store timeout ID

    useEffect(() => {
        if (Object.keys(dependenciesRef.current).length > 0) {
            setInitialRecords();
        }
    }, [dependenciesRef.current]);

    const setInitialRecords = async () => {
        setLoading(true);
        try {
            const queryParams = { ...dependenciesRef.current, per_page: 50 };
            const data = await fetchOptions(dropdownSource, queryParams);
            const records = data.records || [];
            setOptions([...records]);
            if (selectedOption) {
                const current = records.find((itm: any) => itm.id == selectedOption.id);
                if (current) {
                    setSelectedOption(current);
                    delayOnChange(formatEvent(name, current)); // Use delayed onChange
                } else {
                    setSelectedOption(null);
                }
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching options.');
        } finally {
            setLoading(false);
        }
    };

    const dependenciesHandler = (newValue: Record<string, string>) => {
        const newDependencies = { ...dependenciesRef.current, ...newValue };
        dependenciesRef.current = newDependencies;
    };

    useDropdownDependenciesListeners(modelID, dropdownSource, dropdownDependsOn, dependenciesHandler);

    const handleChange = (e: React.ChangeEvent<{}>, newValue: any) => {
        setSelectedOption(newValue);
        if (newValue) {
            delayOnChange(formatEvent(name, newValue)); // Use delayed onChange
        }
    };

    useEffect(() => {
        ensureCurrentRecordIsSelected();
    }, [options, record]);

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
        }, 300),
        [dropdownSource]
    );

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        if (event && event.isTrusted) {
            const inputExistsInOptions = options.some(option => option.name === newInputValue);
            if (newInputValue.trim() !== '' && !inputExistsInOptions) {
                fetchOptionsThrottled(newInputValue);
            }
        }
    };

    const ensureCurrentRecordIsSelected = async () => {
        if (record && value) {
            if (ensuredRecord.current === String(record.id)) return;

            const exists = options.find((itm) => String(itm.id) === String(record[name]));
            if (exists) {
                setSelectedOption(exists);
                delayOnChange(formatEvent(name, exists)); // Use delayed onChange
            } else {
                setLoading(true);
                try {
                    const data = await fetchOptions(dropdownSource, { ...dependenciesRef.current, id: record[name] });
                    const records = data.records || [];
                    setOptions([...records, ...options]);
                    const current = records.find((itm: any) => itm.id == record[name]);
                    if (current) {
                        setSelectedOption(current);
                        delayOnChange(formatEvent(name, current)); // Use delayed onChange
                    }
                } catch (error: any) {
                    // Handle error
                }
                setLoading(false);
            }

            ensuredRecord.current = String(record.id);
        }
    };

    const delayOnChange = (eventData: any) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            onChange(eventData);
        }, 250);
    };

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

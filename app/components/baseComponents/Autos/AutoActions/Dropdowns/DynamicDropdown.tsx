import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FormControl, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { ServerModelOptionType } from '../../../types';
import fetchOptions from '../../../utils/fetchOptions';
import throttle from '../../../utils/throttle';
import { formatEvent } from './helpers';

type Props = {
    modelID: string;
    name: string;
    serverModelOptions: ServerModelOptionType;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    dropdownSource: string;
    size?: 'small' | 'medium';
    record?: Record<string, any> | null;
};

const DynamicDropdown: React.FC<Props> = ({
    name,
    serverModelOptions,
    value,
    onChange,
    dropdownSource,
    size = 'medium',
    record,
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any>(options.find((option) => option.id === value) || null);
    const [loading, setLoading] = useState<boolean>(false);
    const ensuredRecord = useRef<string | undefined>();
    const timeoutRef = useRef<number | null>(null); // Ref to store timeout ID

    useEffect(() => {
        setInitialRecords();
    }, [dropdownSource, serverModelOptions]);

    const setInitialRecords = () => {
        setLoading(true);
        const exists = serverModelOptions?.[dropdownSource];
        if (exists) {
            setOptions(exists.records || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        ensureCurrentRecordIsSelected();
    }, [options, record]);

    const fetchOptionsThrottled = useCallback(
        throttle(async (searchTerm: string) => {
            setLoading(true);
            try {
                const data = await fetchOptions(dropdownSource, { search: searchTerm });
                setOptions(data.records || []);
            } catch (error: any) {
                // Handle error
            }
            setLoading(false);
        }, 300), // Throttle requests to every 300ms
        [dropdownSource]
    );

    const handleChange = (e: React.ChangeEvent<{}>, newValue: any) => {
        setSelectedOption(newValue);
        if (newValue) {
            delayOnChange(formatEvent(name, newValue)); // Use delayed onChange
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        if (event && event.isTrusted) {
            const inputExistsInOptions = options.some(option => option.name === newInputValue);
            if (newInputValue.trim() !== '') {
                if (!inputExistsInOptions) {
                    fetchOptionsThrottled(newInputValue);
                }
            } else {
                setInitialRecords();
            }
        }
    };

    const ensureCurrentRecordIsSelected = async () => {
        if (options.length > 0 && record && value) {
            if (ensuredRecord.current === String(record.id)) return; // Exit if already called for current record

            const exists = options.find((itm) => String(itm.id) === String(record[name]));
            if (exists) {
                setSelectedOption(exists);
                delayOnChange(formatEvent(name, exists)); // Use delayed onChange
            } else {
                setLoading(true);
                try {
                    const data = await fetchOptions(dropdownSource, { id: record[name] });
                    const records = data.records || [];
                    setOptions([...records, ...options]);
                    const current = records.find((itm: any) => String(itm.id) === String(record[name]));
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
        }, 150);
    };

    return (
        <FormControl fullWidth variant="outlined" size={size} margin="normal">
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
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </FormControl>
    );
};

export default DynamicDropdown;

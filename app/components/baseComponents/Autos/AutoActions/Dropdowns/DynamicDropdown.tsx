import React, { useState, useEffect, useCallback } from 'react';
import { FormControl, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { ServerModelOptionType } from '../../../types';
import fetchOptions from '../../../utils/fetchOptions';
import throttle from '../../../utils/throttle';
import { formatEvent } from './helpers';

type Props = {
    modelID: string;
    name: string;
    serverModelOptions: ServerModelOptionType;
    value: string;
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

    useEffect(() => {
        setInitialRecords()
    }, [dropdownSource, serverModelOptions]);

    useEffect(() => {
        ensureCurrentRecordIsSelected()
    }, [record]);

    function setInitialRecords() {
        setLoading(true);
        const exists = serverModelOptions[dropdownSource];
        if (exists) {
            setOptions(exists.records || []);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

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

    function handleChange(e: React.ChangeEvent<{}>, newValue: any) {
        setSelectedOption(newValue)
        if (newValue) {
            onChange(formatEvent(name, newValue));
        }
    }

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        if (event && event.isTrusted) {
            const inputExistsInOptions = options.some(option => option.name === newInputValue);

            if (newInputValue.trim() !== '') {
                if (!inputExistsInOptions) {
                    fetchOptionsThrottled(newInputValue);
                }
            } else {
                setInitialRecords()
            }
        }
    };

    async function ensureCurrentRecordIsSelected() {
        if (record && value) {
            const exists = options.find((itm) => itm.id === record.id);
            if (exists) {
                setSelectedOption(exists)
                onChange(formatEvent(name, exists));

            } else {
                setLoading(true);
                try {
                    const data = await fetchOptions(dropdownSource, { id: record[name] });
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

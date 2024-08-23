import React, { useState, useEffect, useCallback } from 'react';
import { FormControl, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { ServerModelOptionType } from '../../types';
import fetchOptions from '../../utils/fetchOptions';

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
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const exists = serverModelOptions[dropdownSource];
        if (exists) {
            setOptions(exists.records || []);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [dropdownSource, serverModelOptions]);


    useEffect(() => {
        const selected = options.find((option) => option.id === value) || null;
        setSelectedOption(selected);
    }, []);

    useEffect(() => {
        ensureCurrentRecordIsSelected()
    }, [record, name, value]);

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

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        fetchOptionsThrottled(newInputValue);
    };

    async function ensureCurrentRecordIsSelected() {
        if (record && value) {
            fetchOptions(dropdownSource, { id: record[name] })
            setLoading(true);
            try {
                const data = await fetchOptions(dropdownSource, { id: record[name] });
                const records = data.records || []
                setOptions(records);
                const current = records.find((itm: any) => itm.id == record[name])
                if (current) {
                    setSelectedOption(current)
                    onChange(e as React.ChangeEvent<{ value: unknown }>);
                }

            } catch (error: any) {
                // Handle error
            }
            setLoading(false);

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

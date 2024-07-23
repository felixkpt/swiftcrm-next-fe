import React, { useState, useEffect } from 'react';
import { appConfig } from '../../utils/helpers';

type Props = {
    modelID: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    dropdownSource: string;
    record?: Record<string, any> | null;
    size?: 'sm' | 'md' | 'lg';
};

const DynamicDropdown: React.FC<Props> = ({ name, value, onChange, dropdownSource, record, size = 'md' }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${appConfig.api.url(dropdownSource)}/`);

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
                onChange({ target: { name, value: exists.id } as React.ChangeEvent<HTMLSelectElement> });
            }
        }
    }, [record, options, name, value]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-700">{error}</p>;

    const sizeClass = size === 'sm' ? 'select-sm' : size === 'lg' ? 'select-lg' : 'select-md';

    return (
        <div>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`select select-bordered w-full ${sizeClass}`}
            >
                <option value="">Select...</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DynamicDropdown;

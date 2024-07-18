// src/components/DynamicDropdown.tsx

import React, { useState, useEffect } from 'react';
import { appConfig } from '../../utils/helpers';

type Props = {
    componentId: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    dropdownSource: string;
};

const DynamicDropdown: React.FC<Props> = ({ name, value, onChange, dropdownSource }) => {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-700">{error}</p>;

    return (
        <div className="mb-4">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
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

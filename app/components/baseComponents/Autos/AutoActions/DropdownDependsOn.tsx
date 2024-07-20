import React, { useState, useEffect } from 'react';
import { appConfig, subscribe } from '../../utils/helpers';

type Props = {
    componentId: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    dropdownSource: string;
    dropdownDependsOn: string[] | null;
    size?: 'sm' | 'md' | 'lg';
};

const DropdownDependsOn: React.FC<Props> = ({
    componentId,
    name,
    value,
    onChange,
    dropdownSource,
    dropdownDependsOn,
    size = 'md',
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDependencies, setCurrentDependencies] = useState<Record<string, string>>({});

    // Function to fetch options based on current dependencies
    const fetchOptions = async (params: Record<string, string>) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${appConfig.api.url(dropdownSource)}/?${queryParams}`);

            if (!response.ok) throw new Error('Failed to fetch options');
            const data = await response.json();
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
    }

    // Effect to set up listeners and fetch options based on dependencies
    useEffect(() => {
        if (dropdownDependsOn) {
            const listeners = dropdownDependsOn.map(dep => {
                const listenerId = `${componentId}_update_${dep}`;
                const unsubscribe = subscribe(listenerId, dependenciesHandler);
                return unsubscribe;
            });

            return () => {
                listeners.forEach(unsub => unsub());
            };
        }
    }, [componentId, dropdownSource, dropdownDependsOn]);

    useEffect(() => {
        if (Object.keys(currentDependencies).length > 0) {
            fetchOptions(currentDependencies);
        }
    }, [currentDependencies])

    if (error) return <p className="text-red-700">{error}</p>;

    const sizeClass = size === 'sm' ? 'select-sm' : size === 'lg' ? 'select-lg' : 'select-md';

    return (
        <div>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                data-dropdown-source={dropdownSource}
                data-dropdown-depends-on={dropdownDependsOn}
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

export default DropdownDependsOn;

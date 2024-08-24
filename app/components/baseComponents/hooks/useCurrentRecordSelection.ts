import { useState, useEffect } from 'react';
import fetchOptions from '../../utils/fetchOptions';

const useEnsureCurrentRecordSelected = (record: Record<string, any> | null, value: string, name: string, dropdownSource: string, options: any[], onChange: (e: React.ChangeEvent<{ value: unknown }>) => void) => {
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function ensureCurrentRecordIsSelected() {
            if (record && value) {
                const exists = options.find((itm) => itm.id === record.id);
                if (exists) {
                    setSelectedOption(exists);
                    onChange({ target: { name, value: exists.id } } as unknown as React.ChangeEvent<{ value: unknown }>);
                } else {
                    setLoading(true);
                    try {
                        const data = await fetchOptions(dropdownSource, { id: record[name] });
                        const records = data.records || [];
                        setSelectedOption(records.find((itm: any) => itm.id == record[name]) || null);
                        setLoading(false);
                    } catch (error: any) {
                        // Handle error
                        setLoading(false);
                    }
                }
            }
        }

        ensureCurrentRecordIsSelected();
    }, [record, value, name, dropdownSource, options, onChange]);

    return { selectedOption, loading };
};

export default useEnsureCurrentRecordSelected;

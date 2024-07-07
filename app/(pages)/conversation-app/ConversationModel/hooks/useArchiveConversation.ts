import { useState } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';

const useArchiveConversation = () => {
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const archiveConversation = async (selectedCategory: any, selectedSubCategory: any, mode: string, setMessages: (messages: any[]) => void) => {
        if (!selectedCategory?.id || !selectedSubCategory?.id) return;

        setIsResetting(true);
        setError(null);

        try {
            const resp = await axios.put(appConfig.api.url(`/dashboard/categories/${selectedCategory.id}/sub-categories/${selectedSubCategory.id}/archive?mode=${mode}`));
            if (resp.status === 200) {
                setMessages([]);
            } else {
                setError('Server returned an unexpected response.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(`Error: ${(error as Error).message}`);
            }
        } finally {
            setIsResetting(false);
        }
    };

    return { isResetting, error, archiveConversation };
};

export default useArchiveConversation;

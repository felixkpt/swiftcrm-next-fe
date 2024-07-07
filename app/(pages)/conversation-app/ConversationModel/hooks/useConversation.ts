import { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { MessageType, ResultsMetaDataType } from '../types';
import SubCategoryType from '@/app/(pages)/dashboard/categories/[categoryId]/sub-categories/AutoModel/types';
import CategoryType from '@/app/(pages)/dashboard/categories/AutoModel/types';

export const useConversation = (
    selectedCategory: CategoryType | undefined,
    selectedSubCategory: SubCategoryType | undefined,
    mode: string,
    setMessages: (messages: MessageType[]) => void,
    setMessagesMetadata:(messages: MessageType[]) => void,
) => {
    const [reloadKey, setReloadKey] = useState<number>(0);
    const [interviewProgress, setInterviewProgress] = useState<{ current_question: number; total_count: number } | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<number | string>(0);

    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedCategory?.id || !selectedSubCategory?.id || !currentSessionId) return;

            try {
                const uri = `/dashboard/sub-categories/${selectedSubCategory.id}/conversation?mode=${mode}&interview_id=${currentSessionId}`;
                const response = await axios.get<ResultsMetaDataType>(appConfig.api.url(uri));
                setMessages(response.data.results || []);
                setMessagesMetadata(response.data.metadata || null)

                getInterviewSession();
            } catch (error) {
                console.error('Error fetching conversation messages:', error);
            }
        };

        fetchConversation();
    }, [selectedCategory, selectedSubCategory, currentSessionId, mode, setMessages, reloadKey]);

    useEffect(() => {
        if (reloadKey > 0) {
            getInterviewSession();
        }
    }, [reloadKey]);

    const getInterviewSession = async () => {
        if (!selectedCategory?.id || !selectedSubCategory?.id || !currentSessionId) return;

        const uri = `/dashboard/interview/${selectedSubCategory.id}/progress?interview_id=${currentSessionId}`;
        try {
            const response = await axios.get<{ current_question: number; total_count: number }>(appConfig.api.url(uri));
            setInterviewProgress(response.data);
        } catch (error) {
            console.error('Error fetching interview session details:', error);
        }
    };

    return { interviewProgress, setReloadKey, currentSessionId, setCurrentSessionId };
};

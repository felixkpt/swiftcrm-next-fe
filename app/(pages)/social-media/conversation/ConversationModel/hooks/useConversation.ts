import { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { MessageType, ResultsMetaDataType } from '../types';
import SubCategoryType from '@/app/(pages)/social-media/conversation/categories/[categoryId]/sub-categories/AutoModel/types';
import CategoryType from '@/app/(pages)/social-media/conversation/categories/AutoModel/types';

export const useConversation = (
    selectedSubCategory: SubCategoryType | undefined,
) => {
    const [reloadKey, setReloadKey] = useState<number>(0);
    const [interviewProgress, setInterviewProgress] = useState<{ current_question: number; total_count: number } | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<number | string>(0);


    useEffect(() => {
        if (reloadKey > 0) {
            getInterviewSession();
        }
    }, [reloadKey]);
    
    useEffect(() => {
        getInterviewSession();
    }, [selectedSubCategory]);

    const getInterviewSession = async () => {
        if (!selectedSubCategory?.id ) return;

        const uri = `/social-media/conversation/interview/${selectedSubCategory.id}/progress`;
        try {
            const response = await axios.get<{ current_question: number; total_count: number }>(appConfig.api.url(uri));
            setInterviewProgress(response.data);
        } catch (error) {
            console.error('Error fetching interview session details:', error);
        }
    };

    return { interviewProgress, setReloadKey, currentSessionId, setCurrentSessionId };
};

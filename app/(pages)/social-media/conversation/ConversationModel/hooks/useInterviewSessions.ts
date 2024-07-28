import { useState, useEffect } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import SubCategoryType from '@/app/(pages)/social-media/conversation/categories/[categoryId]/sub-categories/AutoModel/types';
import { CategoryType, InterviewSessionType } from '../types';

type InterviewSessionWithMetadataType = {
    results: InterviewSessionType[]
    metadata: any

}

export const useInterviewSessions = (selectedCategory: CategoryType | undefined, selectedSubCategory: SubCategoryType | undefined) => {
    const [reloadKey, setReloadKey] = useState<number>(0);
    const [interviewSessions, setInterviewSessions] = useState<InterviewSessionType[]>([]);

    useEffect(() => {
        if (interviewSessions.length === 0 || reloadKey > 0) {
            fetchInterviewSessions();
        }

    }, [selectedCategory, selectedSubCategory, reloadKey]);

    const fetchInterviewSessions = async () => {
        if (!selectedCategory || !selectedSubCategory?.id) return;

        try {
            const response = await axios.get<InterviewSessionWithMetadataType>(appConfig.api.url(`/social-media/conversation/interview/results/categories/${selectedCategory.id}/sub-category/${selectedSubCategory.id}?status_id=0&sess=1`));
            console.log('interviewSessions::::::', response.data.records)
            setInterviewSessions(response.data.records || []);

        } catch (error) {
            console.error('Error fetching interview sessions:', error);
        }
    };

    return { interviewSessions, setReloadKey };
};

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';

type Props = {
    selectedCategory: any
    selectedSubCategory: any
    setCurrentSessionId: any
    setMessages: any
    setMessagesMetadata: any
    reloadKey: any
}

const InterviewProgress = ({ selectedCategory, selectedSubCategory, reloadKey }: Props) => {

    const [interviewProgress, setInterviewProgress] = useState<{ interview_id: number, current_question: number; total_count: number } | null>(null);

    useEffect(() => {
        if (reloadKey > 0) {
            getInterviewProgress();
        }
    }, [reloadKey]);

    useEffect(() => {
        getInterviewProgress();
    }, [selectedCategory, selectedSubCategory]);

    const getInterviewProgress = async () => {
        if (!selectedCategory?.id || !selectedSubCategory?.id) return;

        const uri = `/social-media/conversation/interview/${selectedSubCategory.id}/progress`;
        try {
            const response = await axios.get<{ current_question: number; total_count: number }>(appConfig.api.url(uri));
            setInterviewProgress(response.data);
        } catch (error) {
            console.error('Error fetching interview session details:', error);
        }
    };

    console.log('interviewProgress::', interviewProgress)

    return (
        <div className='flex flex-row items-center gap-3 pb-1'>
            <label className="w-full h-full">
                {interviewProgress && (
                    <div className='flex flex-col w-full'>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text text-xs text-nowrap">Interview Progress</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="label-text text-xs text-nowrap">Questions answered: {interviewProgress.current_question} / {interviewProgress.total_count}</span>
                                {interviewProgress.current_question === interviewProgress.total_count && (
                                    <Link
                                        target='_blank'
                                        href={`/social-media/conversation/interview/results/${interviewProgress.interview_id}`}
                                        className="btn btn-sm btn-success mb-0.5"
                                    >
                                        Show My Results
                                    </Link>
                                )}
                            </div>
                            <progress className="progress progress-info w-full" value={`${interviewProgress.current_question / interviewProgress.total_count * 100}`} max="100"></progress>
                        </label>
                    </div>
                )}
            </label>
        </div>
    )
}

export default InterviewProgress
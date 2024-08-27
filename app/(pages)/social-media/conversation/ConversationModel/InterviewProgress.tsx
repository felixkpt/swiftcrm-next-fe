import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { Box, Typography, LinearProgress, Button, Paper } from '@mui/material';

type Props = {
    selectedCategory: any;
    selectedSubCategory: any;
    reloadKey: any;
}

const InterviewProgress = ({ selectedCategory, selectedSubCategory, reloadKey }: Props) => {
    const [interviewProgress, setInterviewProgress] = useState<{ interview_id: number; current_question: number; total_count: number } | null>(null);

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

    return (
        <Box display="flex" flexDirection="row" alignItems="center" gap={2} padding={1}>
            {interviewProgress && interviewProgress.interview_id && (
                <Paper elevation={3} style={{ padding: 16, width: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Interview Progress
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">
                            Questions answered: {interviewProgress.current_question} / {interviewProgress.total_count}
                        </Typography>
                        {interviewProgress.current_question === interviewProgress.total_count && (
                            <Link href={`/social-media/conversation/interview/results/${interviewProgress.interview_id}`} passHref>
                                <Button variant="contained" color="success" size="small">
                                    Show My Results
                                </Button>
                            </Link>
                        )}
                    </Box>
                    <Box mt={1}>
                        <LinearProgress
                            variant="determinate"
                            value={(interviewProgress.current_question / interviewProgress.total_count) * 100}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default InterviewProgress;

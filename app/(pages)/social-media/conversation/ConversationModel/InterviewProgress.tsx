import React, { useEffect } from 'react'
import { useInterviewSessions } from './hooks/useInterviewSessions';
import { useConversation } from './hooks/useConversation';
import Link from 'next/link';

type Props = {
    selectedCategory: any
    selectedSubCategory: any
    setCurrentSessionId: any
    setMessages: any
    setMessagesMetadata: any
    reloadKey: any
}

const InterviewProgress = ({ selectedCategory, selectedSubCategory, setCurrentSessionId, setMessages, setMessagesMetadata, reloadKey }: Props) => {

    const { interviewSessions, setReloadKey: setReloadKeyInterviewSessions } = useInterviewSessions(selectedCategory, selectedSubCategory);

    const { interviewProgress, setReloadKey, currentSessionId, setCurrentSessionId: setCurrentSessionIdConversation } = useConversation(selectedCategory, selectedSubCategory, 'interview', setMessages, setMessagesMetadata);

    useEffect(() => {
        if (interviewSessions.length > 0) {
            const activeSession = interviewSessions.find(session => session.status_id === 1);
            if (activeSession) {
                setCurrentSessionId(activeSession.id);
                setCurrentSessionIdConversation(activeSession.id);
            }
        }
    }, [interviewSessions])

    useEffect(() => {
        if (reloadKey && reloadKey > 0) {
            setReloadKey(reloadKey)
            setReloadKeyInterviewSessions(reloadKey)
        }
    }, [reloadKey])

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
                                        href={`/social-media/conversation/interview/results/${currentSessionId}`}
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
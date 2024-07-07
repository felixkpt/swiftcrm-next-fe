/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import axios from 'axios';
import { useParams } from 'next/navigation';

const page = () => {
    const conversationsContainer = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<any[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [maxScore, setMaxScore] = useState<number>(0);
    const [percentageScore, setPercentageScore] = useState<number>(0);

    const { interviewId } = useParams()
    console.log('interviewId::', interviewId)

    // Fetch interview results based on the interview ID
    useEffect(() => {
        const fetchResults = async () => {

            if (!interviewId) return

            try {
                setIsLoading(true)
                const uri = `/dashboard/interview/results/${interviewId}`
                const response = await axios.get(appConfig.api.url(uri));
                console.log('response.data::', uri, response.data)
                setResults(response.data.results || []);
                setTotalScore(response.data.total_score);
                setMaxScore(response.data.max_score);
                setPercentageScore(response.data.percentage_score);
            } catch (error) {
                console.error('Error fetching interview results:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchResults();
    }, [interviewId]);

    return (
        <div className="p-1">
            <div className="mx-auto bg-base-200 p-2 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Interview Results</h2>
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div ref={conversationsContainer}>
                        {results.map((result, index) => (
                            <div key={index} className="mb-4">
                                <p className="font-bold text-xl text-emerald-600">Question {index + 1}:</p>
                                <p className="m-2">{result.question}</p>
                                <p className="m-2 text-emerald-600">Your answer:</p>
                                <p className="m-2">{result.answer}</p>
                                <p className="m-2 text-emerald-600">Score:</p>
                                <p className="m-2">{`${result.score} / ${result.max_score}`}</p>
                                <hr className="my-4 border-1 border-emerald-600" />
                            </div>
                        ))}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold">Final Score:</h3>
                            <p className="m-2"><strong className='text-emerald-600'>Total Score:</strong> {totalScore}</p>
                            <p className="m-2"><strong className='text-emerald-600'>Maximum Score:</strong> {maxScore}</p>
                            <p className="m-2"><strong className='text-emerald-600'>Percentage Score:</strong> {percentageScore}%</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page

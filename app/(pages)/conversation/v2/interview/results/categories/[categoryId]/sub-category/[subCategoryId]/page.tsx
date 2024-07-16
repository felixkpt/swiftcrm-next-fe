/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import InterviewListCard from '@/app/(pages)/conversation/v2/interview/session/components/InterviewListCard';
import { MetadataType, ResultsType } from '@/app/(pages)/conversation/v2/ConversationModel/types';
import { useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Page = () => {
  const { categoryId, subCategoryId } = useParams()
  const interviewsContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResultsType>([]);
  const [metadata, setMetadata] = useState<MetadataType>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!categoryId || !subCategoryId) return null;

      try {
        setIsLoading(true);
        const uri = `/conversation/v2/interview/results/categories/${categoryId}/sub-category/${subCategoryId}`;
        const response = await axios.get(appConfig.api.url(uri));
        const data = response.data;

        // Prepare chart data
        const chartLabels = data.results.map((interview: any) => interview.question);
        const chartScores = data.results.map((interview: any) => interview.score);

        setResults(data.results || []);
        setMetadata(data.metadata || null);
        setChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Interview Scores',
            data: chartScores,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Error fetching interview results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [categoryId, subCategoryId]);

  return (
    <div className="p-1">
      <div className="mx-auto bg-base-200 p-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">{metadata?.title || 'Interview Results'}</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div ref={interviewsContainer}>
            {results.map((interview, index) => (
              <div key={index} className="mb-4">
                <InterviewListCard interview={interview} />
                <p className="text-lg mb-2">
                  <span className="text-blue-600">{`Score: ${interview.score}`}</span>
                </p>
              </div>
            ))}
            {chartData && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Interview Scores Chart</h3>
                <Bar data={chartData} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

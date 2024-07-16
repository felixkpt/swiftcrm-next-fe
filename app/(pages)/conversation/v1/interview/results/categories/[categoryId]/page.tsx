/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { MetadataType, InterviewSessionType, SubCategoryType } from '@/app/(pages)/conversation/v1/ConversationModel/types';
import { useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

type ExendedSubCategoryType = SubCategoryType & {
  total_count: number;
  interviews: InterviewSessionType[];
  average_performance: number;

};

const Page = () => {
  const { categoryId } = useParams();
  const interviewsContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subcategories, setSubcategories] = useState<ExendedSubCategoryType[]>([]);
  const [metadata, setMetadata] = useState<MetadataType>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!categoryId) return;

      try {
        setIsLoading(true);
        const uri = `/dashboard/interview/completed-by-categories/${categoryId}`;
        const response = await axios.get(appConfig.api.url(uri));
        const results: ExendedSubCategoryType[] = response.data.results || [];
        const updatedSubcategories: ExendedSubCategoryType[] = results.map(sub_category => ({
          ...sub_category,
          average_performance: calculateAveragePerformance(sub_category.interviews),
        }));

        setSubcategories(updatedSubcategories);
        setMetadata(response.data.metadata || null);
      } catch (error) {
        console.error('Error fetching interview results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [categoryId]);

  // Function to calculate average performance metric for sub-category
  const calculateAveragePerformance = (interviews: InterviewSessionType[]): number => {
    if (interviews.length === 0) return 0;

    let totalSum = 0;
    interviews.forEach(interview => {
      totalSum += interview.current_question_id; // Replace with relevant performance metric
    });

    return totalSum / interviews.length;
  };

  
  // Function to generate chart data
  const generateChartData = (subcategory: ExendedSubCategoryType): any => {
    const labels: string[] = subcategory.interviews.map(interview => interview.sub_category_name);
    const data: number[] = subcategory.interviews.map(interview => interview.current_question_id);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Performance',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Adjust colors as needed
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          maxBarThickness: 150, // Adjust the value as needed (in pixels)
        },
      ],
    };
  };


  return (
    <div className="p-1">
      <div className="mx-auto bg-base-200 p-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">{metadata?.title || 'Interview Results'}</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div ref={interviewsContainer}>
            {subcategories.map((sub_category, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{sub_category.name} ({sub_category.total_count})</h3>
                <p className="text-lg mb-2">
                  <span className="text-blue-600">{`Average Performance: ${sub_category.average_performance.toFixed(0)}`}</span>
                  <Link href={`/conversation-app/interview/results/categories/${categoryId}/sub-category/${sub_category.id}`}>
                    <span className="ml-2 text-blue-600 hover:underline">View Interviews</span>
                  </Link>
                </p>
                <Bar data={generateChartData(sub_category)} options={{ maintainAspectRatio: true }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { CategoryType, InterviewSessionType, MetadataType } from '@/app/(pages)/conversation/v1/ConversationModel/types';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

type ExtendedCategoryType = CategoryType & {
  total_count: number;
  interviews: InterviewSessionType[];
  sub_categories: {
    id: number;
    name: string;
    total_count: number;
    interviews: InterviewSessionType[];
  }[];
};

const Page = () => {
  const interviewsContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ExtendedCategoryType[]>([]);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);

  useEffect(() => {
    if (categories.length > 0) return;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(appConfig.api.url('/dashboard/interview/completed-by-categories'));
        setCategories(response.data.results || []);
        setMetadata(response.data.metadata || null);
      } catch (error) {
        console.error('Error fetching interview results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const generateChartData = (category: ExtendedCategoryType) => {
    const subCategories = category.sub_categories;
    const labels: string[] = [];
    const data: number[] = [];
  
    // Calculate average performance metric across all interviews in the category
    let totalSum = 0;
    let totalCount = 0;
  
    subCategories.forEach(subCategory => {
      subCategory.interviews.forEach(interview => {
        totalSum += interview.current_question_id; // Replace with relevant performance metric sum
        totalCount++;
      });
    });
  
    const average = totalCount > 0 ? totalSum / totalCount : 0;
  
    // Prepare label and data for the chart
    labels.push(category.name);
    data.push(average);
  
    return {
      labels,
      datasets: [
        {
          label: `Average Performance`,
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          maxBarThickness: 150, // Adjust the value as needed (in pixels)
        },
      ],
    };
  };
  
  return (
    <div className="p-1">
      <div className="mx-auto bg-base-200 p-2 rounded-lg shadow-lg cursor-default">
        <h2 className="text-2xl font-semibold mb-6">{metadata?.title || 'Interview Results'} ({metadata?.total_count || 0})</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div ref={interviewsContainer}>
            {categories.map((category, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}, Sub Categories ({category.sub_categories.length}), Interviews ({category.sub_categories.reduce((p, c)=>p+c.total_count, 0)})</h3>
                <p className="text-lg mb-2">
                  <Link href={`/conversation-app/interview/results/categories/${category.id}`}>
                    <span className="text-blue-600 hover:underline">View sub_categories</span>
                  </Link>
                </p>
                <Bar data={generateChartData(category)} options={{ maintainAspectRatio: true }} />
                {category.sub_categories.map((subcategory, subIndex) => (
                  <div key={subIndex} className="ml-4 mt-2">
                    <p className="text-lg font-semibold">{subcategory.name} ({subcategory.total_count})</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

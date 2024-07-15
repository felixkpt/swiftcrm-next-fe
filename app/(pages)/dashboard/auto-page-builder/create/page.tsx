import React from 'react';
import Builder from '../components/Builder';
import { saveAndGenerateModel } from '../utils/modelGenerator';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { inputTypes } from '../utils/constants';
import { AutoPageBuilderType } from '../utils/backendTypes';

async function getDropdownSourcesList() {
  const url = appConfig.api.url('dashboard/auto-page-builder');
  try {
    const response = await fetch(url, { next: { tags: ['auto-page-builder'] } });

    if (!response.ok) {
      throw new Error('Failed to fetch dropdown sources');
    }
    const data = await response.json();
    console.log('dashboard/auto-page-builder::', data?.length)
    return data;
  } catch (error) {
    console.error('Error fetching dropdown sources:', error);
    return [];
  }
}

const Page = async () => {

  const dropdownSourcesList: AutoPageBuilderType[] = await getDropdownSourcesList()

  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

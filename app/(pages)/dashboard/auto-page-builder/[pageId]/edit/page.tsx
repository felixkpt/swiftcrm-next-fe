import React from 'react';
import Builder from '../../components/Builder';
import { saveAndGenerateModel } from '../../utils/modelGenerator';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import { inputTypes } from '../../utils/constants';

async function getDropdownSourcesList() {
  const url = appConfig.api.url('dashboard/auto-page-builder');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch dropdown sources');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dropdown sources:', error);
    return [];
  }
}

const Page = async () => {
  const dropdownSourcesList: RecordType[] = await getDropdownSourcesList()
  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

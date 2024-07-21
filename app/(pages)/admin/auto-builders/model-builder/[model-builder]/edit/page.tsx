import React from 'react';
import Builder from '../../components/Builder';
import { saveAndGenerateModel } from '../../utils/modelGenerator';
import { RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import { inputTypes } from '../../utils/constants';
import getDropdownSourcesList from '../../utils/getDropdownSourcesList';

const Page = async () => {
  const dropdownSourcesList: RecordType[] = await getDropdownSourcesList()
  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

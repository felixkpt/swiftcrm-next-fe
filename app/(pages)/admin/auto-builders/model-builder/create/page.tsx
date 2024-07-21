import React from 'react';
import Builder from '../components/Builder';
import { saveAndGenerateModel } from '../utils/modelGenerator';
import { inputTypes } from '../utils/constants';
import { AutoPageBuilderType } from '../utils/backendTypes';
import getDropdownSourcesList from '../utils/getDropdownSourcesList';

const Page = async () => {

  const dropdownSourcesList: AutoPageBuilderType[] = await getDropdownSourcesList()

  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

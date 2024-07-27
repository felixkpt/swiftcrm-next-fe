import React from 'react';
import Builder from '../Module/components/Builder';
import { saveAndGenerateModel } from '../Module/utils/modelGenerator';
import { inputTypes } from '../Module/utils/constants';
import { AutoPageBuilderType } from '../Module/utils/backendTypes';
import getDropdownSourcesList from '../Module/utils/getDropdownSourcesList';
import getConstants from '../AutoModel/getConstants';

const Page = async () => {

  // Destructure constants from getConstants
  const {
    MODEL_ID,
    MODEL_NAME_PLURAL,
    API_ENDPOINT,
  } = getConstants;

  const dropdownSourcesList: AutoPageBuilderType[] = await getDropdownSourcesList(API_ENDPOINT, MODEL_ID, MODEL_NAME_PLURAL)

  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

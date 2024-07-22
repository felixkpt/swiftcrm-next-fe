import React from 'react';
import Builder from '../../components/Builder';
import { saveAndGenerateModel } from '../../utils/modelGenerator';
import { inputTypes } from '../../utils/constants';
import getDropdownSourcesList from '../../utils/getDropdownSourcesList';
import { AutoPageBuilderType } from '../../utils/backendTypes';
import getConstants from '../../AutoModel/getConstants';

const Page = async () => {

  // Destructure constants from getConstants
  const {
    MODEL_NAME_PLURAL,
    MODEL_ID,
    API_ENDPOINT,
  } = getConstants;

  const dropdownSourcesList: AutoPageBuilderType[] = await getDropdownSourcesList(API_ENDPOINT, MODEL_ID, MODEL_NAME_PLURAL)

  return <Builder inputTypes={inputTypes} dropdownSourcesList={dropdownSourcesList} saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

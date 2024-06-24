// app/(pages)/dashboard/auto-page-builder/editor
import React from 'react';
import Builder from '../components/Builder';
import { saveAndGenerateModel } from '../utils/modelGenerator';

const Page = () => {
  return <Builder saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

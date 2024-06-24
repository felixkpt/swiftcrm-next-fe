// app/(pages)/dashboard/auto-page-builder/[pageId]/edit/page.tsx
import React from 'react';
import { saveAndGenerateModel } from '../../utils/modelGenerator';
import Builder from '../../components/Builder';

const Page = () => {
    return <Builder saveAndGenerateModel={saveAndGenerateModel} />;
};

export default Page;

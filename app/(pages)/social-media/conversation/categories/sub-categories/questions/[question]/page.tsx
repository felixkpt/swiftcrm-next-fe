
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
// Third-party imports
import { usePathname } from 'next/navigation';

// AutoModel/Component imports
import getConstants from '../AutoModel/getConstants';
import Renderer from '@/app/components/baseComponents/Autos/AutoPage/RenderSingle';

// Internal utility imports
import fetchOptions from '@/app/components/baseComponents/utils/fetchOptions';

const page = () => {
  const {
    MODEL_NAME_SINGULAR,
    MODEL_NAME_PLURAL,
    MODEL_ID,
    ACTION_LABELS,
    HEADERS,
    FILLABLE_FIELDS
  } = getConstants;

  const pathname = usePathname()
  const apiEndpoint = pathname;

  const actionType = 'buttons'
  const actionLabels = ACTION_LABELS
  const isSingle = true
  return (
    <>
      <Renderer
        modelNameSingular={MODEL_NAME_SINGULAR}
        modelNamePlural={MODEL_NAME_PLURAL}
        modelID={MODEL_ID}
        fillableFields={FILLABLE_FIELDS}
        headers={HEADERS}
        actionLabels={actionLabels}
        actionType={actionType} // Type of action (e.g., create, edit)
        apiEndpoint={apiEndpoint}
        fetchOptions={fetchOptions} // Function to fetch options based on endpoint and parameters
        isSingle={isSingle}
      />
    </>
  );
};

export default page;


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
        modelNameSingular={MODEL_NAME_SINGULAR} // Model name for display purposes
        modelNamePlural={MODEL_NAME_PLURAL} // Plural model name for API and display
        modelID={MODEL_ID} // Unique component identifier
        fillableFields={FILLABLE_FIELDS} // Fields that are fillable
        headers={HEADERS} // HTTP headers for API requests
        actionLabels={actionLabels} // Labels for different actions (e.g., create, update)
        actionType={actionType} // Type of action (e.g., dropdown, buttons)
        apiEndpoint={apiEndpoint} // API endpoint for fetching records
        fetchOptions={fetchOptions} // Function to fetch options based on endpoint and parameters
        isSingle={isSingle} // Indicates whether the component is in single mode
      />
    </>
  );
};

export default page;

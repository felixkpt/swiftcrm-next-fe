
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
// Third-party imports
import { usePathname } from 'next/navigation';

// AutoModel/Component imports
import getConstants from '../AutoModel/getConstants';
import Renderer from '@/app/components/baseComponents/Autos/AutoPage/RenderSingle';

// Internal utility imports

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

  const ACTION_TYPE = 'buttons'
  const isSingle = true
  return (
    <>
      <Renderer
        modelID={MODEL_ID} // Unique component identifier
        modelNameSingular={MODEL_NAME_SINGULAR} // Model name for display purposes
        modelNamePlural={MODEL_NAME_PLURAL} // Plural model name for display
        fillableFields={FILLABLE_FIELDS} // Fields that are fillable
        headers={HEADERS} // Table headers
        actionLabels={ACTION_LABELS} // Labels for different actions (e.g., create, update)
        actionType={ACTION_TYPE} // Type of action (e.g., dropdown, buttons)
        apiEndpoint={apiEndpoint} // API endpoint for fetching records
        serverModelOptions={serverModelOptions} // Model's grouped options
        isSingle={isSingle} // Indicates whether the component is in single mode
      />
    </>
  );
};

export default page;

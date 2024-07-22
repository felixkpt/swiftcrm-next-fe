
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { usePathname } from 'next/navigation';
// Start AutoModel imports
import getConstants from '../AutoModel/getConstants';
import mapRecords from '../AutoModel/mapRecords';
import Renderer from '@/app/components/baseComponents/Autos/AutoPage/RenderSingle';
// End AutoModel imports

const page = () => {
  const {
    MODEL_NAME,
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
        modelNameSingular={MODEL_NAME}
        modelNamePlural={MODEL_NAME_PLURAL}
        componentId={MODEL_ID}
        apiEndpoint={apiEndpoint}
        fillableFields={FILLABLE_FIELDS}
        headers={HEADERS}
        mapRecords={records => mapRecords(records, MODEL_ID, apiEndpoint, actionLabels, actionType, isSingle)}
        actionLabels={actionLabels}
        isSingle={isSingle}
      />
    </>
  );
};

export default page;

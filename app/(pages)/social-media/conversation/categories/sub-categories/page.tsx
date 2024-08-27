
// Third-party imports
import { revalidateTag } from 'next/cache';

// Internal utility imports
import { appConfig, getModelTag } from '@/app/components/baseComponents/utils/helpers';
import fetchRecords from '@/app/components/baseComponents/utils/fetchRecords';

// AutoModel/Component imports
import Renderer from '@/app/components/baseComponents/Autos/AutoPage/RenderList';
import getConstants from './AutoModel/getConstants';
import getServerModelOptions from '@/app/components/baseComponents/utils/getServerModelOptions';

const page = async () => {
  // Destructure constants from getConstants
  const {
    MODEL_NAME_SINGULAR,
    MODEL_NAME_PLURAL,
    MODEL_ID,
    API_ENDPOINT,
    ACTION_LABELS,
    ACTION_TYPE,
    HEADERS,
    FILLABLE_FIELDS
  } = getConstants;

  // Define the API endpoint URL using appConfig
  const apiEndpoint = appConfig.api.url(API_ENDPOINT);

  // Initialize variables for records and metadata
  let records = [];
  let metadata = null;

  try {
    // Fetch records using the fetchRecords helper function
    const { records: fetchedRecords, metadata: fetchedMetadata } = await fetchRecords(apiEndpoint, [MODEL_ID]);
    records = fetchedRecords;
    metadata = fetchedMetadata;
  } catch (error) {
    console.error(`Error fetching ${MODEL_NAME_PLURAL}:`, error);
  }

  // Function to revalidate server records
  async function revalidateServerRecords() {
    'use server';
    const tag = getModelTag(apiEndpoint)
    revalidateTag(tag);
  }

  const serverModelOptions = await getServerModelOptions(FILLABLE_FIELDS);

  return (
    <Renderer
      modelID={MODEL_ID} // Unique component identifier
      modelNameSingular={MODEL_NAME_SINGULAR} // Model name for display purposes
      modelNamePlural={MODEL_NAME_PLURAL} // Plural model name for display
      fillableFields={FILLABLE_FIELDS} // Fields that are fillable
      headers={HEADERS} // Table headers
      actionLabels={ACTION_LABELS} // Labels for different actions (e.g., create, update)
      actionType={ACTION_TYPE} // Type of action (e.g., dropdown, buttons)
      apiEndpoint={API_ENDPOINT} // API endpoint for fetching records
      serverRecords={records} // Initial fetched records to be displayed
      serverModelOptions={serverModelOptions} // Model's grouped options
      revalidateServerRecords={revalidateServerRecords} // Function to revalidate server records
      serverMetadata={metadata} // Metadata associated with the fetched records
    />
  );
};

export default page;

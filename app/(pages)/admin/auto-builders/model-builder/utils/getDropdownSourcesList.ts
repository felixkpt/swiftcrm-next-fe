import fetchRecords from "@/app/components/baseComponents/utils/fetchRecords";
import { appConfig } from "@/app/components/baseComponents/utils/helpers";

async function getDropdownSourcesList() {
    const MODEL_ID = 'model-builder'
    const MODEL_NAME_PLURAL = 'model-builder'
    // Define the API endpoint URL using appConfig
    const apiEndpoint = appConfig.api.url('admin/auto-builders/model-builder');

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

    return records
}

export default getDropdownSourcesList

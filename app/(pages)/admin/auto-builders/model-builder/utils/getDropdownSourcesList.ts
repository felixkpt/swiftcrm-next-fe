import fetchRecords from "@/app/components/baseComponents/utils/fetchRecords";
import { appConfig } from "@/app/components/baseComponents/utils/helpers";

async function getDropdownSourcesList() {
    const COMPONENT_ID = 'auto-page-builder'
    const MODEL_NAME_PLURAL = 'auto-page-builder'
    // Define the API endpoint URL using appConfig
    const apiEndpoint = appConfig.api.url('dashboard/auto-page-builder');

    // Initialize variables for records and metadata
    let records = [];
    let metadata = null;

    try {
        // Fetch records using the fetchRecords helper function
        const { records: fetchedRecords, metadata: fetchedMetadata } = await fetchRecords(apiEndpoint, [COMPONENT_ID]);
        records = fetchedRecords;
        metadata = fetchedMetadata;
    } catch (error) {
        console.error(`Error fetching ${MODEL_NAME_PLURAL}:`, error);
    }

    return records
}

export default getDropdownSourcesList

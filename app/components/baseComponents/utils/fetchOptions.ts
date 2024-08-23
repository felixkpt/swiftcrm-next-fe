import { appConfig } from "./helpers";

// Function to fetch options based on current dependencies
const fetchOptions = async (apiEndpoint: string, params: object) => {
    try {
        const queryParams = new URLSearchParams({ ...params, per_page: 50 }).toString();
        const response = await fetch(`${appConfig.api.url(apiEndpoint)}/?${queryParams}`);

        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();

        return data
    } catch (error: any) {
    } finally {
    }
};


export default fetchOptions
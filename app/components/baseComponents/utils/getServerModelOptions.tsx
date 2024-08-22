import { FillableType } from "../Autos/BaseAutoModel/types";
import { ServerModelOptionType } from "../types";
import fetchRecords from "./fetchRecords";
import { appConfig } from "./helpers";

async function getServerModelOptions(fillableFields: Array<FillableType>): Promise<ServerModelOptionType> {
    const result: ServerModelOptionType = {}; // Initialize as an empty object

    for (const fillable of fillableFields) {
        const dropdownSource = fillable.dropdownSource;
        if (dropdownSource && dropdownSource !== 'None') {
            const data = await fetchRecords(appConfig.api.url(dropdownSource)+'/');
            result[dropdownSource] = data;
        }
    }

    return result;
}

export default getServerModelOptions;

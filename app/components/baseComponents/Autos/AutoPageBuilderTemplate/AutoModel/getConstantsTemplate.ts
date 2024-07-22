export const getConstantsTemplate = `
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = '{autoPageBuilder_modelID}';
const modelNameSingular = '{autoPageBuilder_modelNameSingular}';
const modelNamePlural = '{autoPageBuilder_modelNamePlural}';
const modelURI = '{autoPageBuilder_modelURI}';
const apiEndpoint = '{autoPageBuilder_apiEndpoint}';

// Define fillable fields for the {autoPageBuilder_modelNameSingular} model
const fillableFields = {autoPageBuilder_fillableFields}

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = {autoPageBuilder_headers}

// Define default values for creating a new record
const newRecordDefaults = {autoPageBuilder_newRecordDefaults}

// Define action labels and their associated actions
const actionLabelsActions: ActionLabelsActionsType = {autoPageBuilder_actionLabelsActions};

// Create {autoPageBuilder_modelNameSingular} constants using the createModelConstants function
const getConstants = createModelConstants(
  modelID,          // modelID: UNIQUE ID of the model/page
  modelNameSingular,          // modelNameSingular: Name of the model/page
  modelNamePlural,          // modelNamePlural: Plural name of the model/page
  modelURI,           // modelURI: API endpoint for mode/page
  apiEndpoint,        // apiEndpoint: API endpoint for mode/page
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;
`;

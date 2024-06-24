
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelName = 'Auto page';
const apiEndpoint = '/dashboard/auto-page-builder';

// Define fillable fields for the leadmasters model
const fillableFields = [
  {
    name: "modelName",
    label: "Name",
    type: "input",
    dataType: "biginteger",
    defaultValue: null,
    isRequired: true,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "source_id",
    label: "lead source",
    type: "dropdown",
    dataType: "integer",
    defaultValue: "1",
    isRequired: true,
    dropdownSource: "sources",
    dropdownDependsOn: [
      "countries"
    ]
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = [
  {
    key: "modelName",
    label: "Page name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "modelURI",
    label: "URI",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "apiEndpoint",
    label: "Endpoint",
    isVisibleInList: true,
    isVisibleInSingleView: true
  }
  ,
  {
    key: "action",
    label: "Action",
    isVisibleInList: true,
    isVisibleInSingleView: true
  }
]

// Define default values for creating a new record
const newRecordDefaults = {}

// Define action labels and their associated actions
const actionLabelsActions: ActionLabelsActionsType = {
  viewRecord: {
    actionType: "navigation",
    label: "View lead",
    show: true
  },
  editRecord: {
    actionType: "navigation",
    label: "Edit",
    show: true
  },
  deleteRecord: {
    actionType: "modal",
    label: "Delet!",
    show: true
  }
};

// Create leadmasters constants using the createModelConstants function
const getConstants = createModelConstants(
  modelName,          // modelName: Name of the model
  apiEndpoint,        // apiEndpoint: API endpoint for categories
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;


import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelName = 'tickets';
const modelURI = 'admin/tickets';
const apiEndpoint = 'admin/tickets/';

// Define fillable fields for the tickets model
const fillableFields = [
  {
    name: "source_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "sources",
    dropdownDependsOn: null
  },
  {
    name: "category_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "categories",
    dropdownDependsOn: null
  },
  {
    name: "sub_category_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "sub_categories",
    dropdownDependsOn: null
  },
  {
    name: "user_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "users",
    dropdownDependsOn: null
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = [
  {
    key: "source_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "category_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "sub_category_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "user_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
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
    actionType: "modal",
    label: ""
  },
  editRecord: {
    actionType: "modal",
    label: ""
  },
  deleteRecord: {
    actionType: "modal",
    label: ""
  }
};

// Create tickets constants using the createModelConstants function
const getConstants = createModelConstants(
  modelName,          // modelName: Name of the model/page
  modelURI,           // modelURI: API endpoint for mode/page
  apiEndpoint,        // apiEndpoint: API endpoint for mode/page
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;

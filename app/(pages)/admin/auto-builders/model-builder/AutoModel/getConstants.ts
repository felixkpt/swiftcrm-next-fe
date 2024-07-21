
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelNameSingular = 'Model_builders';
const modelURI = 'admin/auto-builders/model-builder';
const apiEndpoint = 'admin/auto-builders/model-builder/';

// Define fillable fields for the Model_builders model
const fillableFields = [
  {
    name: "name_singular",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "name_plural",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "modelURI",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "apiEndpoint",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "table_name_singular",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: false,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "table_name_plural",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "class_name",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = [
  {
    key: "name_singular",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "name_plural",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "modelURI",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "apiEndpoint",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "table_name_singular",
    label: "",
    isVisibleInList: false,
    isVisibleInSingleView: true
  },
  {
    key: "table_name_plural",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "class_name",
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
    actionType: "navigation",
    label: ""
  },
  editRecord: {
    actionType: "navigation",
    label: ""
  },
  updateRecordStatus: {
    actionType: "modal",
    label: ""
  },
  deleteRecord: {
    actionType: "modal",
    label: ""
  }
};

// Create Model_builders constants using the createModelConstants function
const getConstants = createModelConstants(
  modelNameSingular,          // modelNameSingular: Name of the model/page
  modelURI,           // modelURI: API endpoint for mode/page
  apiEndpoint,        // apiEndpoint: API endpoint for mode/page
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;

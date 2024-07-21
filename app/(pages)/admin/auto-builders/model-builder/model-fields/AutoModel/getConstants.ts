
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelNameSingular = 'Model_fields';
const modelURI = 'admin/auto-builders/model-builder/model-fields';
const apiEndpoint = 'admin/auto-builders/model-builder/model-fields/';

// Define fillable fields for the Model_fields model
const fillableFields = [
  {
    name: "model_builder_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "admin/auto-builders/model-builder",
    dropdownDependsOn: null
  },
  {
    name: "name",
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
    name: "type",
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
    name: "label",
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
    name: "dataType",
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
    name: "defaultValue",
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
  },
  {
    name: "isVisibleInList",
    label: "",
    type: "input",
    dataType: "boolean",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "isVisibleInSingleView",
    label: "",
    type: "input",
    dataType: "boolean",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "isRequired",
    label: "",
    type: "input",
    dataType: "boolean",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "isUnique",
    label: "",
    type: "input",
    dataType: "boolean",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "dropdownSource",
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
  },
  {
    name: "dropdownDependsOn",
    label: "",
    type: "textarea",
    dataType: "json",
    defaultValue: null,
    isRequired: false,
    isVisibleInList: false,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "desktopWidth",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "12",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "mobileWidth",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "12",
    isRequired: true,
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
    key: "model_builder_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "name",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "type",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "label",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "dataType",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "defaultValue",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "isVisibleInList",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "isVisibleInSingleView",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "isRequired",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "isUnique",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "dropdownSource",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "dropdownDependsOn",
    label: "",
    isVisibleInList: false,
    isVisibleInSingleView: true
  },
  {
    key: "desktopWidth",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "mobileWidth",
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
  }
};

// Create Model_fields constants using the createModelConstants function
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


import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType, FillableType, HeaderType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = '3799253d-e81a-455d-9e5b-8b220d93bfd2';
const modelNameSingular = 'model-builder';
const modelNamePlural = 'model-builders';
const modelURI = 'auto-builders/model-builder';
const apiEndpoint = 'auto-builders/model-builder/';

// Define fillable fields for the model-builder model
const fillableFields: Array<FillableType> = [
  {
    name: "uuid",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "modelDisplayName",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "nameSingular",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "namePlural",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "modelURI",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "apiEndpoint",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "tableNameSingular",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "tableNamePlural",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: true,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "className",
    label: "",
    type: "input",
    dataType: "string",
    defaultValue: "None",
    isRequired: false,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "createFrontendViews",
    label: "",
    type: "input",
    dataType: "boolean",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers: HeaderType[] = [
  {
    key: "uuid",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "modelDisplayName",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "nameSingular",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "namePlural",
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
    key: "tableNameSingular",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "tableNamePlural",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "className",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "createFrontendViews",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "action",
    label: "Action",
    isVisibleInList: true,
    isVisibleInSingleView: true,
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

// Create model-builder constants using the createModelConstants function
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


import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType, FillableType, HeaderType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = '45e913e5-2b08-4278-9252-6ed49794fb7a';
const modelNameSingular = 'user';
const modelNamePlural = 'users';
const modelURI = 'users';
const apiEndpoint = 'users/';

// Define fillable fields for the user model
const fillableFields: Array<FillableType> = [
  {
    name: "first_name",
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
    desktopWidth: 6,
    mobileWidth: 12
  },
  {
    name: "last_name",
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
    desktopWidth: 6,
    mobileWidth: 12
  },
  {
    name: "email",
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
    name: "phone_number",
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
    desktopWidth: 6,
    mobileWidth: 12
  },
  {
    name: "alternate_phone",
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
    desktopWidth: 6,
    mobileWidth: 12
  },
  {
    name: "password",
    label: "",
    type: "input",
    dataType: "password",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: false,
    isVisibleInSingleView: false,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 6,
    mobileWidth: 12
  },
  {
    name: "password_confirmation",
    label: "",
    type: "input",
    dataType: "password",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: false,
    isVisibleInSingleView: false,
    isUnique: false,
    dropdownSource: "None",
    dropdownDependsOn: null,
    desktopWidth: 6,
    mobileWidth: 12
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers: HeaderType[] = [
  {
    key: "first_name",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "last_name",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "email",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "phone_number",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "alternate_phone",
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
    actionType: "modal",
    label: ""
  },
  deleteRecord: {
    actionType: "modal",
    label: ""
  }
};

// Create user constants using the createModelConstants function
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

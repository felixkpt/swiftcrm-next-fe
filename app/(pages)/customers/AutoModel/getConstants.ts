
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType, FillableType, HeaderType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = 'ace26c4f-1cee-4181-b47a-3ce50a97016c';
const modelNameSingular = 'Customer';
const modelNamePlural = 'Customers';
const modelURI = 'customers';
const apiEndpoint = 'customers/';

// Define fillable fields for the Customer model
const fillableFields: Array<FillableType> = [
  {
    name: "first_name",
    label: "First Name",
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
    name: "last_name",
    label: "Last Name",
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
    name: "phone_number",
    label: "Phone Number",
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
    name: "email",
    label: "Email",
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
    name: "alternate_number",
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
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers: HeaderType[] = [
  {
    key: "first_name",
    label: "First Name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "last_name",
    label: "Last Name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "phone_number",
    label: "Phone Number",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "email",
    label: "Email",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "alternate_number",
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
  updateRecordStatus: {
    actionType: "modal",
    label: ""
  },
  deleteRecord: {
    actionType: "modal",
    label: ""
  }
};

// Create Customer constants using the createModelConstants function
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

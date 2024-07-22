
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType, FillableType, HeaderType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = 'a90a45b5-40c6-45b6-b140-36fd3355fab9';
const modelNameSingular = 'sub-category';
const modelNamePlural = 'sub-categories';
const modelURI = 'social-media/conversation/categories/sub-categories';
const apiEndpoint = 'social-media/conversation/categories/sub-categories/';

// Define fillable fields for the sub-category model
const fillableFields: Array<FillableType> = [
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
    dropdownSource: "conversation/categories",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
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
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "learn_instructions",
    label: "",
    type: "textarea",
    dataType: "text",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers: HeaderType[] = [
  {
    key: "sub_category_id",
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
    key: "learn_instructions",
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

// Create sub-category constants using the createModelConstants function
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

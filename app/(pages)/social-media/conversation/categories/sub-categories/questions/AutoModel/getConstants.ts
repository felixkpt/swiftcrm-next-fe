
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType, FillableType, HeaderType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelID = 'e5994ad6-f144-4855-919a-8e000741b635';
const modelNameSingular = 'Question';
const modelNamePlural = 'Questions';
const modelURI = 'social-media/conversation/categories/sub-categories/questions';
const apiEndpoint = 'social-media/conversation/categories/sub-categories/questions/';

// Define fillable fields for the Question model
const fillableFields: Array<FillableType> = [
  {
    name: "category_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "social-media/conversation/categories",
    dropdownDependsOn: null,
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "sub_category_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: "None",
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "social-media/conversation/categories/sub-categories",
    dropdownDependsOn: [
      "social-media/conversation/categories"
    ],
    desktopWidth: 12,
    mobileWidth: 12
  },
  {
    name: "question",
    label: "",
    type: "textarea",
    dataType: "text",
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
    name: "marks",
    label: "",
    type: "input",
    dataType: "integer",
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
    key: "question",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "marks",
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
  }
};

// Create Question constants using the createModelConstants function
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

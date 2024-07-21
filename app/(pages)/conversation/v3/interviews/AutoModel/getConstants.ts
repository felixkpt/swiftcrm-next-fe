
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelNameSingular = 'Interviews';
const modelURI = 'conversation/v3/interviews';
const apiEndpoint = 'conversation/v3/interviews/';

// Define fillable fields for the Interviews model
const fillableFields = [
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
    dropdownSource: "admin/users",
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
    dropdownSource: "conversation/v3/categories",
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
    dropdownSource: "conversation/v3/categories/sub-categories",
    dropdownDependsOn: [
      "conversation/v3/categories"
    ]
  },
  {
    name: "question_id",
    label: "",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: "conversation/v3/categories/sub-categories/questions",
    dropdownDependsOn: null
  },
  {
    name: "scores",
    label: "",
    type: "input",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "max_scores",
    label: "",
    type: "input",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    isVisibleInList: true,
    isVisibleInSingleView: true,
    isUnique: false,
    dropdownSource: null,
    dropdownDependsOn: null
  },
  {
    name: "percentage_score",
    label: "",
    type: "input",
    dataType: "integer",
    defaultValue: null,
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
    key: "user_id",
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
    key: "question_id",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "scores",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "max_scores",
    label: "",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "percentage_score",
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
  updateRecordStatus: {
    actionType: "modal",
    label: ""
  }
};

// Create Interviews constants using the createModelConstants function
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

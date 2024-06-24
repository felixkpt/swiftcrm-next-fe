
import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelName = 'leads';
const apiEndpoint = 'adm/leads';

// Define fillable fields for the leads model
const fillableFields = [
  {
    name: "source_id",
    label: "Lead SRC",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "sources",
    dropdownDependsOn: null
  },
  {
    name: "customer_id",
    label: "Customer name",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "customers",
    dropdownDependsOn: null
  },
  {
    name: "category_id",
    label: "Cat Name",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "categories",
    dropdownDependsOn: [
      "sources"
    ]
  },
  {
    name: "sub_category_id",
    label: "Sub Cat Name",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "sub_categories",
    dropdownDependsOn: [
      "categories",
      "sources"
    ]
  },
  {
    name: "disposition_id",
    label: "Customer Dispo",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "dispositions",
    dropdownDependsOn: [
      "sources",
      "categories",
      "sub_categories"
    ]
  },
  {
    name: "comments",
    label: "Lead comment",
    type: "textarea",
    dataType: "text",
    defaultValue: null,
    isRequired: true,
    dropdownSource: null,
    dropdownDependsOn: null
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = [
  {
    key: "source_id",
    label: "Lead SRC",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "customer_id",
    label: "Customer name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "category_id",
    label: "Cat Name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "sub_category_id",
    label: "Sub Cat Name",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "disposition_id",
    label: "Customer Dispo",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "comments",
    label: "Lead comment",
    isVisibleInList: false,
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
    label: "View Lead >",
    show: true
  },
  editRecord: {
    actionType: "modal",
    label: "< Edit Lead >",
    show: true
  },
  updateRecordStatus: {
    actionType: "modal",
    label: "Update >>>",
    show: true
  },
  deleteRecord: {
    actionType: "modal",
    label: "Delete Lead!",
    show: true
  }
};

// Create leads constants using the createModelConstants function
const getConstants = createModelConstants(
  modelName,          // modelName: Name of the model
  apiEndpoint,        // apiEndpoint: API endpoint for categories
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;


import createModelConstants from "@/app/components/baseComponents/Autos/BaseAutoModel/constants";
import { ActionLabelsActionsType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";

// Define variables for model name and API endpoint
const modelName = 'tickets';
const apiEndpoint = 'admin/tickets';

// Define fillable fields for the tickets model
const fillableFields = [
  {
    name: "source_id",
    label: "Ticket source",
    type: "dropdown",
    dataType: "integer",
    defaultValue: "1",
    isRequired: true,
    dropdownSource: "sources",
    dropdownDependsOn: null
  },
  {
    name: "customer_id",
    label: "TKT Customer",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "customers",
    dropdownDependsOn: null
  },
  {
    name: "disposition_id",
    label: "Dispo",
    type: "dropdown",
    dataType: "integer",
    defaultValue: null,
    isRequired: true,
    dropdownSource: "dispositions",
    dropdownDependsOn: [
      "sources"
    ]
  }
]

// Define headers for displaying in the UI (e.g., table headers, singleViewOnly means can only be shown when viewing one item not list/table)
const headers = [
  {
    key: "source_id",
    label: "Ticket source",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "customer_id",
    label: "TKT Customer",
    isVisibleInList: true,
    isVisibleInSingleView: true
  },
  {
    key: "disposition_id",
    label: "Dispo",
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
    label: "View ticket >",
    show: true
  },
  editRecord: {
    actionType: "modal",
    label: "EDT TKT",
    show: true
  },
  deleteRecord: {
    actionType: "modal",
    label: "Delete TKT",
    show: true
  },

};

// Create tickets constants using the createModelConstants function
const getConstants = createModelConstants(
  modelName,          // modelName: Name of the model
  apiEndpoint,        // apiEndpoint: API endpoint for categories
  fillableFields,     // fillableFields: Fields that can be filled when creating or updating records
  headers,            // headers: Headers to display in the UI
  newRecordDefaults,  // newRecordDefaults: Default values for creating a new record
  actionLabelsActions // actionLabelsActions: Actions associated with action labels
);

export default getConstants;

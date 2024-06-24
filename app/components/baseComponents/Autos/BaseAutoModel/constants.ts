import { ActionListType, ActionType, ActionLabelsActionsType, FillableType } from "./types";
import Pluralize from 'pluralize';

// Define the structure of the constants object returned by createModelConstants
type ModelConstants = {
  MODEL_NAME: string;
  MODEL_NAME_PLURAL: string;
  COMPONENT_ID: string;
  API_ENDPOINT: string;
  FILLABLE_FIELDS: Array<FillableType>;
  HEADERS: Array<{ key: string, label: string }>;
  NEW_RECORD_DEFAULTS: Record<string, any>;
  ACTION_LABELS: Partial<ActionListType>;
  ACTION_TYPE: ActionType;
};

// Function to create constants specific to a model
const createModelConstants = (
  modelName: string,
  apiEndpoint: string,
  fillableFields: Array<FillableType>,
  headers: Array<{ key: string, label: string }>,
  newRecordDefaults: Record<string, any>,
  actionLabelsActions: ActionLabelsActionsType
): ModelConstants => {
  const modelNamePlural = Pluralize(modelName, true)

  // Define default action labels with action type
  for (const key in actionLabelsActions) {
    if (key === 'viewRecord') {
      actionLabelsActions[key] = { ...actionLabelsActions[key], ...{ slug: null, classes: 'text-blue-500', } }
    } else if (key === 'editRecord') {
      actionLabelsActions[key] = { ...actionLabelsActions[key], ...{ slug: 'edit', classes: 'text-yellow-500' } }
    } else if (key === 'updateRecordStatus') {
      actionLabelsActions[key] = { ...actionLabelsActions[key], ...{ slug: 'update-status', classes: 'text-green-500', } }
    } else if (key === 'archiveRecord') {
      actionLabelsActions[key] = { ...actionLabelsActions[key], ...{ slug: 'archive', classes: 'text-gray-500', } }
    } else if (key === 'deleteRecord') {
      actionLabelsActions[key] = { ...actionLabelsActions[key], ...{ slug: 'delete', classes: 'text-red-500', } }
    }
  }

  // Filter action labels based on 'show' property
  const filteredActionLabels: any = {};
  for (const key in actionLabelsActions) {
    const defAct: any = actionLabelsActions

    if (defAct[key].show) {
      filteredActionLabels[key] = defAct[key];
    }
  }

  return {
    MODEL_NAME: modelName,
    MODEL_NAME_PLURAL: modelNamePlural,
    COMPONENT_ID: `${modelName}Component`,
    API_ENDPOINT: apiEndpoint,
    FILLABLE_FIELDS: fillableFields,
    HEADERS: headers,
    NEW_RECORD_DEFAULTS: newRecordDefaults,
    ACTION_LABELS: filteredActionLabels as Partial<ActionListType>,
    ACTION_TYPE: 'dropdown', // Default action type is dropdown
  };
};

export default createModelConstants;

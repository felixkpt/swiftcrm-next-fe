import { ActionListType, ActionType, ActionLabelsActionsType, FillableType, ModelConstants } from "./types";
import Pluralize from 'pluralize';

// Function to create constants specific to a model
const createModelConstants = (
  modelNameSingular: string,
  modelURI: string,
  apiEndpoint: string,
  fillableFields: Array<FillableType>,
  headers: Array<{ key: string, label: string }>,
  newRecordDefaults: Record<string, any>,
  actionLabelsActions: ActionLabelsActionsType
): ModelConstants => {
  const modelNamePlural = Pluralize(modelNameSingular, true);

  // Define default action labels with action type
  for (const key in actionLabelsActions) {
    if (actionLabelsActions.hasOwnProperty(key)) {
      const action = actionLabelsActions[key as keyof ActionLabelsActionsType];
      if (key === 'viewRecord') {
        actionLabelsActions[key as keyof ActionLabelsActionsType] = { ...action, label: action?.label || 'View', slug: null, classes: 'text-blue-500', actionType: action?.actionType || 'modal' };
      } else if (key === 'editRecord') {
        actionLabelsActions[key as keyof ActionLabelsActionsType] = { ...action, label: action?.label || 'Edit', slug: 'edit', classes: 'text-yellow-500', actionType: action?.actionType || 'modal' };
      } else if (key === 'updateRecordStatus') {
        actionLabelsActions[key as keyof ActionLabelsActionsType] = { ...action, label: action?.label || 'Update', slug: 'update-status', classes: 'text-green-500', actionType: action?.actionType || 'modal' };
      } else if (key === 'archiveRecord') {
        actionLabelsActions[key as keyof ActionLabelsActionsType] = { ...action, label: action?.label || 'Archive', slug: 'archive', classes: 'text-gray-500', actionType: action?.actionType || 'modal' };
      } else if (key === 'deleteRecord') {
        actionLabelsActions[key as keyof ActionLabelsActionsType] = { ...action, label: action?.label || 'Delete', slug: 'delete', classes: 'text-red-500', actionType: action?.actionType || 'modal' };
      }
    }
  }

  return {
    MODEL_NAME: modelNameSingular,
    MODEL_NAME_PLURAL: modelNamePlural,
    COMPONENT_ID: `${modelNameSingular}Component`,
    MODEL_URI: modelURI,
    API_ENDPOINT: apiEndpoint,
    FILLABLE_FIELDS: fillableFields,
    HEADERS: headers,
    NEW_RECORD_DEFAULTS: newRecordDefaults,
    ACTION_LABELS: actionLabelsActions as Partial<ActionListType>,
    ACTION_TYPE: 'dropdown', // Default action type is dropdown
  };
};

export default createModelConstants;

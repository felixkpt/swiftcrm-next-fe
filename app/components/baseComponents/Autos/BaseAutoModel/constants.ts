import { ActionListType, ActionType, ActionLabelsActionsType, FillableType } from "./types";
import Pluralize from 'pluralize';

// Define the structure of the constants object returned by createModelConstants
type ModelConstants = {
  MODEL_NAME: string;
  MODEL_NAME_PLURAL: string;
  COMPONENT_ID: string;
  MODEL_URI: string;
  API_ENDPOINT: string;
  FILLABLE_FIELDS: Array<FillableType>;
  HEADERS: Array<{ key: string, label: string }>;
  NEW_RECORD_DEFAULTS: Record<string, any>;
  ACTION_LABELS: Partial<ActionListType>;
  ACTION_TYPE: ActionType;
};

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

export type KnownActionsType = 'viewRecord' | 'editRecord' | 'updateRecordStatus' | 'archiveRecord' | 'deleteRecord';

export type RecordType = { [key: string]: any };

export interface ActionHandlersInterface {
  viewRecord: (record: RecordType, headers: HeaderType[]) => void;
  editRecord: (record: RecordType) => void;
  updateRecordStatus: (record: RecordType) => void;
  archiveRecord: (record: RecordType) => void;
  deleteRecord: (record: RecordType) => void;
}

export type ActionType = 'dropdown' | 'buttons'

export type ActionItemType = {
  label: string;
  slug: string | null;
  classes: string;
  actionType: 'modal' | 'navigation';
  show: boolean
};

export type ActionLabelsActionsType = {
  viewRecord?: Pick<ActionItemType, 'actionType' | 'label'>;
  editRecord?: Pick<ActionItemType, 'actionType' | 'label'>;
  updateRecordStatus?: Pick<ActionItemType, 'actionType' | 'label'>;
  archiveRecord?: Pick<ActionItemType, 'actionType' | 'label'>;
  deleteRecord?: Pick<ActionItemType, 'actionType' | 'label'>;
};

export type ActionListType = {
  [key in KnownActionsType]: ActionItemType;
};

export type HeaderType = {
  key: string;
  searchKey?: string;
  label?: string;
  isVisibleInList?: boolean
  isVisibleInSingleView?: boolean
};

export type FillableType = {
  name: string;
  type: string;
  label: string;
  isRequired?: boolean;
  dataType?: any;
  defaultValue?: any;
  hidden?: boolean
};

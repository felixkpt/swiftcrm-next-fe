// app/(pages)/dashboard/auto-page-builder/utils/helpers.ts
import Pluralize from 'pluralize';
import { ActionLabelType, ActionLabelTypeValidation, FieldType, FieldValidation } from "../types";
import { ActionLabelSchema, AutoPageBuilderType, FieldSchema, HeaderSchema } from "./backendTypes";
import { newActionLabel, newField } from "./constants";

export function removeQuotesFromKeys(obj: any) {
  const jsonObject = JSON.parse(JSON.stringify(obj, null, 2));
  const formattedString = JSON.stringify(jsonObject, null, 2).replace(/"(\w+)":/g, '$1:');
  return formattedString;
}

export function processTemplate(template: string, data: AutoPageBuilderType) {
  const blacklisted = ['id', 'created_at', 'updated_at']

  let apiEndpoint = data.apiEndpoint
  // Ensure apiEndpoint ends with '/'
  if (!apiEndpoint.endsWith('/')) {
    apiEndpoint += '/';
  }

  return template
    .replace(/{autoPageBuilder_modelNameSingular}/g, data.modelNameSingular)
    .replace(/{autoPageBuilder_modelURI}/g, data.modelURI)
    .replace(/{autoPageBuilder_apiEndpoint}/g, apiEndpoint)
    .replace(/{autoPageBuilder_fillableFields}/g, removeQuotesFromKeys(data.fields.filter((itm) => !blacklisted.includes(itm.name))))
    .replace(/{autoPageBuilder_headers}/g, removeQuotesFromKeys(data.headers))
    .replace(/{autoPageBuilder_newRecordDefaults}/g, removeQuotesFromKeys({}))
    .replace(/{autoPageBuilder_actionLabelsActions}/g, removeQuotesFromKeys(data.actionLabels || {}));
}

export const inferTypeFromValue = (value: any): string => {
  if (typeof value === 'string') {
    if (value === 'now') {
      return 'Date';
    }
    return 'string';
  } else if (typeof value === 'number') {
    return 'number';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (Array.isArray(value)) {
    if (value.length > 0) {
      return `Array<${inferTypeFromValue(value[0])}>`;
    } else {
      return 'any[]';
    }
  } else if (typeof value === 'object' && value !== null) {
    const properties = Object.entries(value).map(([key, val]) => {
      const type = inferTypeFromValue(val);
      return `${key}: ${type}`;
    });
    return `{ ${properties.join(', ')} }`;
  } else {
    return 'any';
  }
};

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFieldsAndHeaders(fieldsRaw: FieldType[]) {
  const defaultFields: FieldSchema[] = [
    { name: 'id', type: 'integer', label: 'id', isRequired: false, dataType: 'integer' },
    { name: 'created_at', type: 'datetime', label: 'Created', isRequired: false, dataType: 'string' },
    { name: 'updated_at', type: 'datetime', label: 'Updated', isRequired: false, dataType: 'string' },
  ];

  const newFields: FieldSchema[] | Array<any> = []
  const headers: HeaderSchema | Array<any> = []
  fieldsRaw.map((field: any) => {

    // getting field and updating field list
    const name = field.name.value
    const label = field.label.value
    const type = field.type.value
    const defaultValue = field.defaultValue.value !== "" ? field.defaultValue.value : null
    const dataType = field.dataType.value !== "" ? field.dataType.value : null

    const isRequired = field.isRequired.value ? true : false
    const isVisibleInList = field.isVisibleInList.value ? true : false
    const isVisibleInSingleView = field.isVisibleInSingleView.value ? true : false
    const isUnique = field.isUnique.value ? true : false

    const dropdownSource = field.dropdownSource.value !== "" ? field.dropdownSource.value : null
    const dropdownDependsOn = field.dropdownDependsOn.value.length !== 0 ? field.dropdownDependsOn.value : null

    const newField: FieldSchema = {
      name,
      label,
      type,
      dataType,
      defaultValue,
      isRequired,

      isVisibleInList,
      isVisibleInSingleView,
      isUnique,

      dropdownSource,
      dropdownDependsOn,
    }

    newFields.push(newField)

    // getting header and updating header2 list
    if (isVisibleInList || isVisibleInSingleView) {
      const newHeader: HeaderSchema = {
        key: name,
        label,
        isVisibleInList,
        isVisibleInSingleView,
      }
      headers.push(newHeader)
    }

  })

  headers.push(
    {
      key: "action",
      label: "Action",
      isVisibleInList: true,
      isVisibleInSingleView: true
    }
  )

  const fields = [...defaultFields, ...newFields]

  return { fields, headers }
}


export function getActionLabels(actionLabelsRaw: ActionLabelType[]): ActionLabelSchema[] {
  const newActionLabels: ActionLabelSchema[] = [];

  actionLabelsRaw.forEach((actionLabel) => {
    const newActionLabel: ActionLabelSchema = {
      key: actionLabel.key.value,
      label: actionLabel.label.value,
      actionType: actionLabel.actionType.value,
    };

    newActionLabels.push(newActionLabel);
  });

  return newActionLabels;
}


export const validateDefaultValue = (dataType: string, defaultValue: string): boolean => {
  if (!defaultValue) return true;

  switch (dataType) {
    case 'text':
    case 'string':
    case 'longtext':
      return true; // Any string is valid
    case 'integer':
    case 'biginteger':
      return /^-?\d+$/.test(defaultValue); // Check if the value is an integer
    case 'float':
    case 'double':
    case 'decimal':
      return /^-?\d+(\.\d+)?$/.test(defaultValue); // Check if the value is a float
    case 'boolean':
      return defaultValue === 'true' || defaultValue === 'false'; // Check if the value is boolean
    case 'date':
      return !isNaN(Date.parse(defaultValue)); // Check if the value is a valid date
    case 'uuid':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[4|5|6|7|8|9][0-9a-f]{3}-[8|9|a|b|c|d|e|f][0-9a-f]{3}-[0-9a-f]{12}$/.test(defaultValue); // Check if the value is a valid UUID
    default:
      return true;
  }
};

export function mapExistingFields(fields: FieldSchema[]): FieldType[] {
  const mapped: unknown = fields.map((field) => {
    if (field.name === 'id' || field.name === 'created_at' || field.name === 'updated_at') return null;

    return {
      name: { value: field.name, required: newField.name.required },
      type: { value: field.type || '', required: newField.type.required },
      defaultValue: { value: field.defaultValue || '', required: newField.defaultValue.required },
      isRequired: { value: field.isRequired, required: newField.isRequired.required },
      isVisibleInList: { value: field.isVisibleInList, required: newField.isVisibleInList.required },
      isVisibleInSingleView: { value: field.isVisibleInSingleView, required: newField.isVisibleInSingleView.required },
      label: { value: field.label || '', required: newField.label.required },
      dataType: { value: field.dataType || '', required: newField.dataType.required },
      isUnique: { value: field.isUnique, required: newField.isUnique.required },
      dropdownSource: { value: field.dropdownSource || '', required: newField.dropdownSource.required },
      dropdownDependsOn: { value: field.dropdownDependsOn || [], required: newField.dropdownDependsOn.required },
      desktopWidth: { value: field.desktopWidth || [], required: newField.desktopWidth.required },
      mobileWidth: { value: field.mobileWidth || [], required: newField.mobileWidth.required },
    };
  }).filter((itm) => itm !== null);

  return mapped as FieldType[]
}

export function mapExistingActionLables(actions: ActionLabelSchema[]): ActionLabelType[] {
  return actions.map(action => ({
    key: { value: action.key, required: newActionLabel.key.required },
    label: { value: action.label, required: newActionLabel.label.required },
    actionType: { value: action.actionType, required: newActionLabel.actionType.required },
  }));
}

// Function to check if value is boolean or numeric (0 or 1)
function checkIfIsBooleanOrNumeric(value: any): boolean {
  return typeof value === 'boolean' || value === 0 || value === 1;
}

// Function to create field validation based on updatedField
export function makeFieldValidation(updatedField: FieldType): FieldValidation {

  const res: FieldValidation = {
    name: updatedField.name.required ? updatedField.name.value?.trim() !== '' : !newField.name.required,
    type: updatedField.type.required ? updatedField.type.value?.trim() !== '' : !newField.type.required,
    label: updatedField.label.required ? updatedField.label.value?.trim() !== '' : !newField.label.required,
    dataType: updatedField.dataType.required ? updatedField.dataType?.value?.trim() !== '' : !newField.dataType.required,
    defaultValue: updatedField.defaultValue.required ? updatedField.defaultValue?.value?.trim() !== '' : !newField.defaultValue.required,
    isRequired: updatedField.isRequired.required ? checkIfIsBooleanOrNumeric(updatedField.isRequired.value) : !newField.isRequired.required,
    isUnique: updatedField.isUnique.required ? checkIfIsBooleanOrNumeric(updatedField.isUnique.value) : !newField.isUnique.required,
    isVisibleInList: updatedField.isVisibleInList.required ? checkIfIsBooleanOrNumeric(updatedField.isVisibleInList.value) : !newField.isVisibleInList.required,
    isVisibleInSingleView: updatedField.isVisibleInSingleView.required ? checkIfIsBooleanOrNumeric(updatedField.isVisibleInSingleView.value) : !newField.isVisibleInSingleView.required,
    dropdownSource: updatedField.dropdownSource.required ? updatedField.dropdownSource?.value?.trim() !== '' : !newField.dropdownSource.required,
    dropdownDependsOn: updatedField.dropdownDependsOn.required ? updatedField.dropdownDependsOn?.value?.length !== 0 : !newField.dropdownDependsOn.required,
  }

  return res;
}

export function makeActionLabelValidation(updatedField: ActionLabelType): ActionLabelTypeValidation {
  return {
    key: (updatedField.key.required && updatedField.key.value?.trim() !== '') || !newActionLabel.key.required,
    label: (updatedField.label.required && updatedField.label.value?.trim() !== '') || !newActionLabel.label.required,
    actionType: (updatedField.actionType.required && updatedField.actionType.value?.trim() !== '') || !newActionLabel.actionType.required,
  };
}
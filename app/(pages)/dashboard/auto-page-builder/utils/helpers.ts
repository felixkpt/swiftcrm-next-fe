// app/(pages)/dashboard/auto-page-builder/utils/helpers.ts
import { AutoPageBuilderRequest, FieldSchema, HeaderSchema } from "./backendTypes";

export function removeQuotesFromKeys(obj: any) {
  const jsonObject = JSON.parse(JSON.stringify(obj, null, 2));
  const formattedString = JSON.stringify(jsonObject, null, 2).replace(/"(\w+)":/g, '$1:');
  return formattedString;
}

export function processTemplate(template: string, data: AutoPageBuilderRequest) {
  const blacklisted = ['id', 'created_at', 'updated_at']

  return template
    .replace(/{autoPageBuilder_modelName}/g, data.modelName)
    .replace(/{autoPageBuilder_apiEndpoint}/g, data.apiEndpoint)
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

export function getFieldsAndHeaders(fieldsRaw: FieldSchema[]) {
  const defaultFields: FieldSchema[] = [
    { name: 'id', type: 'integer', label: 'id', isRequired: false, dataType: null, defaultValue: 0 },
    { name: 'created_at', type: 'datetime', label: 'Created', isRequired: false, dataType: null, defaultValue: null },
    { name: 'updated_at', type: 'datetime', label: 'Updated', isRequired: false, dataType: null, defaultValue: null },
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
    const isRequired = field.isRequired.value
    const dropdownSource = field.dropdownSource.value !== "" ? field.dropdownSource.value : null
    const dropdownDependsOn = field.dropdownDependsOn.value.length !== 0 ? field.dropdownDependsOn.value : null

    const newField: FieldSchema = {
      name,
      label,
      type,
      dataType,
      defaultValue,
      isRequired,
      dropdownSource,
      dropdownDependsOn,
    }

    newFields.push(newField)

    const isVisibleInList = field.isVisibleInList.value
    const isVisibleInSingleView = field.isVisibleInSingleView.value
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
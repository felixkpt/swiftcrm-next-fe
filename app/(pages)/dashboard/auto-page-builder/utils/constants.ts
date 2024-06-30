// app/(pages)/dashboard/auto-page-builder/utils/constants.ts
import { ActionLabelType, FieldType, FieldValidation } from "../types";

export const inputTypes = [
    {
        name: 'input',
        commonDataTypes: ['text', 'string', 'integer', 'biginteger', 'boolean', 'float', 'double', 'decimal', 'date', 'datetime', 'timestamp', 'time', 'uuid']
    },
    {
        name: 'textarea',
        commonDataTypes: ['text', 'string', 'longtext', 'json']
    },
    {
        name: 'dropdown',
        commonDataTypes: ['boolean', 'integer', 'uuid']
    }
];

export const newField: FieldType = {
    name: { value: '', required: true },
    type: { value: '', required: true },
    label: { value: '', required: false },
    dataType: { value: '', required: true },
    defaultValue: { value: '', required: false },
    isRequired: { value: true, required: true },
    isVisibleInList: { value: true, required: true },
    isVisibleInSingleView: { value: true, required: true },
    isUnique: { value: false, required: false },
    dropdownSource: { value: '', required: false },
    dropdownDependsOn: { value: [], required: false },
};

const generateValidation = (field: FieldType): FieldValidation => {
    const validation: FieldValidation | any = {};
    for (const key in field) {
        if (field.hasOwnProperty(key)) {
            validation[key] = field[key].required;
        }
    }
    return validation;
};

export const newValidation: FieldValidation = generateValidation(newField);

export const actionLabelsActions = [
    { key: 'viewRecord', label: 'View Record' },
    { key: 'editRecord', label: 'Edit Record' },
    { key: 'updateRecordStatus', label: 'Update Record Status' },
    { key: 'archiveRecord', label: 'Archive Record' },
    { key: 'deleteRecord', label: 'Delete Record' },
];

export const dropdownDependenciesList = [
    'sources',
    'categories',
    'sub_categories',
    'countries',
    'cities',
    'departments',
    'dispositions',
    'users',
    'customers',
];

export const newActionLabel: ActionLabelType = {
    key: { value: '', required: true },
    label: { value: '', required: false },
    actionType: { value: '', required: true },
};

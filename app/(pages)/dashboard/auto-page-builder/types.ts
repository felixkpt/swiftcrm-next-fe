export type FieldType = {
    name: {
        value: string;
        required: boolean;
    };
    type: {
        value: string;
        required: boolean;
    };
    defaultValue: {
        value: any;
        required: boolean;
    };
    isRequired: {
        value: boolean;
        required: boolean;
    };
    isVisibleInList: {
        value: boolean;
        required: boolean;
    };
    isVisibleInSingleView: {
        value: boolean;
        required: boolean;
    };
    label: {
        value: string;
        required: boolean;
    };
    dataType: {
        value: string;
        required: boolean;
    };
    isUnique: {
        value: boolean;
        required: boolean;
    };
    dropdownSource: {
        value: string;
        required: boolean;
    };
    dropdownDependsOn: {
        value: string[];
        required: boolean;
    };
};

export type FieldValidation = {
    name: boolean;
    type: boolean;
    label: boolean;
    dataType: boolean;
    defaultValue: boolean;
    dropdownSource?: boolean;
    dropdownDependsOn?: boolean;
}
export type ActionLabelType = {
    key: string;
    label: string;
    actionType: string;
    show: boolean;
    required?: boolean;
    isRequired?: boolean;
};
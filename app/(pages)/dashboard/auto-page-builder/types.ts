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
    desktopWidth: {
        value: number;
        required: boolean;
    };
    mobileWidth: {
        value: number;
        required: boolean;
    };
};

export type FieldValidation = {
    name: boolean;
    type: boolean;
    label: boolean;
    dataType: boolean;
    defaultValue: boolean;
    isRequired: boolean;
    isUnique: boolean;
    isVisibleInList: boolean;
    isVisibleInSingleView: boolean;
    dropdownSource?: boolean;
    dropdownDependsOn?: boolean;
}

export type ActionLabelType = {
    key: {
        value: string;
        required: boolean;
    };
    label: {
        value: string;
        required: boolean;
    };
    actionType: {
        value: string;
        required: boolean;
    };
};


export type ActionLabelTypeValidation = {
    key: boolean;
    label: boolean;
    actionType: boolean;
}
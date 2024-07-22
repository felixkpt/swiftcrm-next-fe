export type KnownActionsType = 'viewRecord' | 'editRecord' | 'updateRecordStatus' | 'archiveRecord' | 'deleteRecord';

export type RecordType = { [key: string]: any };

export interface ActionHandlersInterface {
    viewRecord: (record: RecordType, headers: HeaderType[]) => void;
    editRecord: (record: RecordType) => void;
    updateRecordStatus: (record: RecordType) => void;
    archiveRecord: (record: RecordType) => void;
    deleteRecord: (record: RecordType) => void;
}

export type ActionType = 'dropdown' | 'buttons';

export type ActionItemType = {
    label: string;
    actionType: 'modal' | 'navigation';
    slug?: string | null;
    classes?: string;
    show?: boolean;
};

export type ActionLabelsActionsType = {
    viewRecord?: ActionItemType;
    editRecord?: ActionItemType;
    updateRecordStatus?: ActionItemType;
    archiveRecord?: ActionItemType;
    deleteRecord?: ActionItemType;
};

export type ActionListType = {
    [key in KnownActionsType]: ActionItemType;
};

export type HeaderType = {
    key: string;
    searchKey?: string;
    label?: string;
    isVisibleInList?: boolean;
    isVisibleInSingleView?: boolean;
};

export type FillableType = {
    name: string;
    type: string;
    label: string;
    isRequired?: boolean;
    dataType?: any;
    defaultValue?: any;
    hidden?: boolean;
    isVisibleInList?: boolean;
    isVisibleInSingleView?: boolean;
    isUnique?: boolean;
    dropdownSource?: string | null;
    dropdownDependsOn?: string[] | null;
    onChangeUpdateList?: string[];
    desktopWidth: number;
    mobileWidth: number;
};

export type CommonDataTypes =
    | 'text' | 'string' | 'integer' | 'biginteger' | 'boolean'
    | 'float' | 'double' | 'decimal' | 'date' | 'datetime'
    | 'timestamp' | 'time' | 'uuid' | 'longtext' | 'json';

export type InputType = {
    name: 'input' | 'textarea' | 'dropdown';
    commonDataTypes: CommonDataTypes[];
};

export type ModelConstants = {
    MODEL_NAME: string;
    MODEL_NAME_PLURAL: string;
    MODEL_ID: string;
    MODEL_URI: string;
    API_ENDPOINT: string;
    FILLABLE_FIELDS: Array<FillableType>;
    HEADERS: Array<{ key: string; label: string }>;
    NEW_RECORD_DEFAULTS: Record<string, any>;
    ACTION_LABELS: Partial<ActionListType>;
    ACTION_TYPE: ActionType;
};

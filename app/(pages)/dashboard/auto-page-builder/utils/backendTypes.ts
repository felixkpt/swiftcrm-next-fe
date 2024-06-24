// app/(pages)/dashboard/auto-page-builder/utils/backendTypes.ts
export interface FieldSchema {
    name: string;
    type: string;
    label: string;
    isRequired: boolean;
    dataType?: string | null;
    defaultValue?: any;
    dropdownSource?: string;
    dropdownDependsOn?: string[];
  }
  
  export interface ActionLabelSchema {
    key: string;
    label: string;
    actionType: string;
    show: boolean;
    required: boolean;
    isRequired: boolean;
  }
  
  export interface HeaderSchema {
    key: string;
    label: string;
    isVisibleInList: boolean;
    isVisibleInSingleView: boolean;
  }
  
  export interface AutoPageBuilderRequest {
    modelName: string;
    modelURI: string;
    apiEndpoint: string;
    fields: FieldSchema[];
    actionLabels: ActionLabelSchema[];
    headers: HeaderSchema[];
  }
  
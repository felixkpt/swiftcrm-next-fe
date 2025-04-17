// app/(pages)/dashboard/auto-page-builder/utils/backendTypes.ts
export interface FieldSchema {
  name: string;
  type: string;
  label: string;
  dataType: string | null;
  defaultValue?: any;

  isRequired?: boolean;
  isVisibleInList?: boolean;
  isVisibleInSingleView?: boolean;
  isUnique?: boolean;

  dropdownSource?: string;
  dropdownDependsOn?: string[];
  desktopWidth?: string[];
  mobileWidth?: string[];
}

export interface ActionLabelSchema {
  key: string;
  label: string;
  actionType: string;
}

export interface HeaderSchema {
  key: string;
  label: string;
  isVisibleInList: boolean;
  isVisibleInSingleView: boolean;
}

export interface AutoPageBuilderType {
  uuid: string
  modelDisplayName: string;
  nameSingular: string;
  namePlural: string;
  modelURI: string;
  apiEndpoint: string;
  fields: FieldSchema[];
  actionLabels: ActionLabelSchema[];
  headers: HeaderSchema[];
  tableNameSingular?: string;
  tableNamePlural?: string;
  className?: string;
  createFrontendViews: boolean;
}

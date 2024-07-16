import React from 'react';
import AutoModal from '../AutoModal';
import AutoCreateOrUpdateRecord from './AutoCreateOrUpdateRecord';
import AutoViewRecord from './AutoViewRecord';
import AutoUpdateStatus from './AutoUpdateStatus';
import AutoDeleteRecord from './AutoDeleteRecord';
import AutoArchiveRecord from './AutoArchiveRecord';
import { FillableType } from '../BaseAutoModel/types';

type Props = {
    componentId: string;
    modelNameSingular: string;
    apiEndpoint: string;
    fillableFields: FillableType[];
};

const AllActionsModals: React.FC<Props> = ({ componentId, modelNameSingular, apiEndpoint, fillableFields }) => {

    const fillableFieldsFiltered = fillableFields.filter((v) => !v.hidden)
    return (
        <div>
            <AutoModal componentId={`${componentId}CreateOrUpdate`} title={modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)}>
                <AutoCreateOrUpdateRecord
                    componentId={`${componentId}CreateOrUpdate`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal componentId={`${componentId}View`} title={modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)}>
                <AutoViewRecord
                    componentId={`${componentId}View`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal componentId={`${componentId}UpdateStatus`} title={modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)}>
                <AutoUpdateStatus
                    componentId={`${componentId}UpdateStatus`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal componentId={`${componentId}Archive`} title={modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)}>
                <AutoArchiveRecord
                    componentId={`${componentId}Archive`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal componentId={`${componentId}Delete`} title={modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)}>
                <AutoDeleteRecord
                    componentId={`${componentId}Delete`}
                    modelNameSingular={modelNameSingular}
                    method="DELETE"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
        </div>
    );
};

export default AllActionsModals;

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AutoHeader from '../AutoHeader';
import DefaultAutoTableHeaderActions from '@/app/components/baseComponents/AutoTableModes/Default/AutoTableHeaderActions';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import useAutoPostDone from '@/app/components/baseComponents/hooks/useAutoPostDone';
import { ActionHandlersInterface, ActionListType, ActionType, FillableType, HeaderType, KnownActionsType, RecordType } from '../BaseAutoModel/types';
import DefaultActionHandlers from '../BaseAutoModel/ActionHandlers';
import AutoTableSingle from '../AutoTableSingle';
import AllActionsModals from '../AutoActions/AllActionsModals';
import AllActionsAutoPosts from '../AutoActions/AllActionsAutoPosts';
import mapRecords from '../BaseAutoModel/mapRecords';
import { getEndpoint } from '../BaseAutoModel/autoFunctions';

type Props = {
  modelID: string;
  modelNameSingular: string;
  modelNamePlural: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (modelID: string, apiEndpoint: string, isSingle?: boolean) => ActionHandlersInterface;
  actionLabels: Partial<ActionListType>;
  actionType: ActionType;
  apiEndpoint: string;
  fetchOptions: (serverModelOptions: (endPoint: string, params: object, tags?: string[])) => Promise<any[]>;
  isSingle?: boolean

};

const Renderer: React.FC<Props> = ({
  modelID,
  modelNameSingular,
  modelNamePlural,
  fillableFields,
  headers,
  AutoTableHeaderActions,
  ActionHandlers,
  actionLabels,
  actionType,
  apiEndpoint,
  fetchOptions,
  isSingle,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(modelID, apiEndpoint, isSingle) : new DefaultActionHandlers(modelID, apiEndpoint, isSingle);

  const router = useRouter();
  const handleActionClick = (actionKey: KnownActionsType, record: any, recordEndpoint: string) => {
    const actionConfig = actionLabels[actionKey]
    if (actionConfig) {
      const dataTarget = getEndpoint(actionLabels, record, recordEndpoint, actionKey);
      if (actionConfig.actionType === 'modal') {
        defaultActionHandlers[actionKey](record, headers);
      } else if (actionConfig.actionType === 'navigation') {
        if (dataTarget) {
          router.push(dataTarget);
        }
      }
    } else {
      console.warn(`Action label for ${actionKey} is undefined.`);
    }
  };

  const [record, setRecord] = useState<RecordType>();

  const { response } = useAutoPostDone({ modelID });

  const fetchRecord = async () => {
    try {
      const response = await axios.get(appConfig.api.url(apiEndpoint));
      setRecord(mapRecords([response.data] || [], modelID, apiEndpoint, actionLabels, actionType, handleActionClick)[0]);

    } catch (error) {
      console.error(`Error fetching ${modelNamePlural}:`, error);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  useEffect(() => {
    if (response && response.status === 200) {
      fetchRecord();
    }
  }, [response]);

  const handleRecordAction = useCallback((target: HTMLElement) => {
    const action = target.getAttribute('data-action') as KnownActionsType;
    const dataTarget = target.getAttribute('data-target') as KnownActionsType;
    const recordId = target.getAttribute('data-id');

    if (action && recordId) {
      if (record) {
        const actionConfig = actionLabels[action];
        if (actionConfig) {
          if (actionConfig.actionType === 'modal') {
            defaultActionHandlers[action](record, headers);
          } else if (actionConfig.actionType === 'navigation') {
            console.log(dataTarget)
            // router.push(dataTarget);
          }
        } else {
          console.error(`Action configuration for "${action}" not found.`);
        }
      } else {
        console.error(`Record with ID ${recordId} not found.`);
      }
    }
  }, [record, actionLabels, defaultActionHandlers, apiEndpoint]);

  useEffect(() => {
    const handleTableClick = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      handleRecordAction(target);
    };

    const componentTable = document.getElementById(`${modelID}AutoTable`);
    if (componentTable) {
      componentTable.addEventListener('click', handleTableClick);
      return () => {
        componentTable.removeEventListener('click', handleTableClick);
      };
    }
  }, [record, handleRecordAction]);

  return (
    <div>
      <AutoHeader
        headerTitle={`${modelNameSingular.charAt(0).toUpperCase() + modelNameSingular.slice(1)} ${record?.id ? '#' + record.id : ''}`}
        description=""
        modelID={`${modelID}CreateOrUpdate`}
      />
      <AutoTableSingle
        record={record}
        headers={headers}
        modelID={modelID}
        AutoTableHeaderActions={AutoTableHeaderActions || DefaultAutoTableHeaderActions}
      />
      <AllActionsModals
        modelID={modelID}
        modelNameSingular={modelNameSingular}
        apiEndpoint={apiEndpoint}
        fillableFields={fillableFields}
        fetchOptions={fetchOptions}
      />
      <AllActionsAutoPosts modelID={modelID} />

    </div>
  );
};

export default Renderer;

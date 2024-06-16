import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AutoHeader from '../AutoHeader';
import DefaultAutoTableHeaderActions from '@/app/components/AutoTableModes/Default/AutoTableHeaderActions';
import { appConfig } from '@/app/utils/helpers';
import useAutoPostDone from '@/app/hooks/useAutoPostDone';
import { ActionHandlersInterface, ActionListType, FillableType, HeaderType, KnownActionsType, RecordType } from '../BaseAutoModel/types';
import DefaultActionHandlers from '../BaseAutoModel/ActionHandlers';
import AutoTableSingle from '../AutoTableSingle';
import AllActionsModals from '../AutoActions/AllActionsModals';
import AllActionsAutoPosts from '../AutoActions/AllActionsAutoPosts';

type Props = {
  modelName: string;
  modelNamePlural: string;
  componentId: string;
  apiEndpoint: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (componentId: string, apiEndpoint: string, isSingle?: boolean) => ActionHandlersInterface;
  mapRecords: (record: any[]) => any[];
  actionLabels: Partial<ActionListType>;
  isSingle?: boolean
};

const Renderer: React.FC<Props> = ({
  modelName,
  modelNamePlural,
  componentId,
  apiEndpoint,
  fillableFields,
  headers,
  AutoTableHeaderActions,
  ActionHandlers,
  mapRecords,
  actionLabels,
  isSingle,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(componentId, apiEndpoint, isSingle) : new DefaultActionHandlers(componentId, apiEndpoint, isSingle);

  const router = useRouter();
  const [record, setRecord] = useState<RecordType>();
  const { response } = useAutoPostDone({ componentId });

  const fetchRecord = async () => {
    try {
      const response = await axios.get(appConfig.api.url(apiEndpoint));
      setRecord(mapRecords([response.data] || [])[0]);
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
          if (actionConfig.action === 'modal') {
            defaultActionHandlers[action](record, headers);
          } else if (actionConfig.action === 'navigation') {
            router.push(dataTarget);
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

    const componentTable = document.getElementById(`${componentId}AutoTable`);
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
        headerTitle={`${modelName.charAt(0).toUpperCase() + modelName.slice(1)} ${record?.id ? '#' + record.id : ''}`}
        description=""
        componentId={`${componentId}CreateOrUpdate`}
      />
      <AutoTableSingle
        record={record}
        headers={headers}
        componentId={componentId}
        AutoTableHeaderActions={AutoTableHeaderActions || DefaultAutoTableHeaderActions}
      />
      <AllActionsModals
        componentId={componentId}
        modelName={modelName}
        apiEndpoint={apiEndpoint}
        fillableFields={fillableFields}
      />
      <AllActionsAutoPosts componentId={componentId} />

    </div>
  );
};

export default Renderer;

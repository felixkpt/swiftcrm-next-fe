'use client'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AutoHeader from '../AutoHeader';
import DefaultAutoTableHeaderActions from '@/app/components/baseComponents/AutoTableModes/Default/AutoTableHeaderActions';
import AutoTable from '../AutoTable';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import useAutoPostDone from '@/app/components/baseComponents/hooks/useAutoPostDone';
import { ActionHandlersInterface, ActionListType, FillableType, HeaderType, KnownActionsType } from '../BaseAutoModel/types';
import DefaultActionHandlers from '../BaseAutoModel/ActionHandlers';
import AllActionsModals from '../AutoActions/AllActionsModals';
import AllActionsAutoPosts from '../AutoActions/AllActionsAutoPosts';
import { MetadataType, ResultsType } from '@/app/(pages)/conversation-app/ConversationModel/types';
import useAutoResolveEndPointPlaceholders from '../BaseAutoModel/useAutoResolveEndPointPlaceholders';
import mapRecords from '@/app/(pages)/dashboard/auto-page-builder/AutoModel/mapRecords';

type Props = {
  modelName: string;
  modelNamePlural: string;
  componentId: string;
  apiEndpoint: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (componentId: string, apiEndpoint: string) => ActionHandlersInterface;
  serverRecords: ResultsType
  revalidateServerRecords:any
  serverMetadata:any
  actionLabels: Partial<ActionListType>;
  actionType: any;
  createUri?: string;
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
  serverRecords,
  revalidateServerRecords,
  serverMetadata,
  actionLabels,
  actionType,
  createUri,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(componentId, apiEndpoint) : new DefaultActionHandlers(componentId, apiEndpoint);

  apiEndpoint = useAutoResolveEndPointPlaceholders({ apiEndpoint });

  const [localApiEndpoint, setLocalApiEndpoint] = useState(apiEndpoint)

  const [headerTitle, setHeaderTitle] = useState(`${modelNamePlural.charAt(0).toUpperCase() + modelNamePlural.slice(1)} list`)

  const router = useRouter();
  serverRecords = mapRecords(serverRecords, componentId, apiEndpoint, actionLabels, actionType);

  const [records, setRecords] = useState<ResultsType>(serverRecords);
  const [metadata, setMetaData] = useState<MetadataType>(serverMetadata);
  const { response } = useAutoPostDone({ componentId });

  const onPageNumberChange = (page: number) => {
    setLocalApiEndpoint(`${apiEndpoint}?page=` + page)
  }

  const fetchRecords = async () => {
    if (!localApiEndpoint) return

    try {
      const response = await axios.get(appConfig.api.url(localApiEndpoint));

      const hasMetaData = response?.data?.metadata
      const data = response?.data
      if (hasMetaData) {
        setHeaderTitle(data.metadata.title);
        setMetaData(data.metadata);
        setRecords(mapRecords(data.results || [], componentId, apiEndpoint, actionLabels, actionType));
      } else {
        setRecords(mapRecords(data || [], componentId, apiEndpoint, actionLabels, actionType));
        setMetaData(null);
      }

    } catch (error) {
      console.error(`Error fetching ${modelNamePlural}:`, error);
    }
  };

  useEffect(() => {
    if (apiEndpoint !== localApiEndpoint) {
      console.log('fetching only....')
      fetchRecords();
    }
  }, [localApiEndpoint]);
  
  useEffect(() => {
    if (response && response.status === 200) {
      console.log('fetching and revalidating....')
      fetchRecords();
      revalidateServerRecords()
    }
  }, [response]);

  const handleRecordAction = useCallback((e: Event) => {
    const target = e.target as HTMLElement;

    const action = target.getAttribute('data-action') as KnownActionsType;
    const dataTarget = target.getAttribute('data-target') as KnownActionsType;
    const recordId = target.getAttribute('data-id');

    if (action && recordId) {
      e.preventDefault();
      const record = records.find(record => record.id.toString() === recordId);
      if (record) {
        const actionConfig = actionLabels[action];
        if (actionConfig) {
          if (actionConfig.actionType === 'modal') {
            defaultActionHandlers[action](record, headers);
          } else if (actionConfig.actionType === 'navigation') {
            router.push(dataTarget);
          }
        } else {
          console.error(`Action configuration for "${action}" not found.`);
        }
      } else {
        console.error(`Record with ID ${recordId} not found.`);
      }
    } else {
    }
  }, [records, actionLabels, defaultActionHandlers, localApiEndpoint]);

  useEffect(() => {
    const handleTableClick = (e: Event) => {
      handleRecordAction(e);
    };

    const componentTable = document.getElementById(`${componentId}AutoTable`);
    if (componentTable) {
      componentTable.addEventListener('click', handleTableClick);
      return () => {
        componentTable.removeEventListener('click', handleTableClick);
      };
    }
  }, [records, handleRecordAction]);

  // Filter out objects where singleViewOnly is true
  let filteredHeaders = headers.filter(item => item.isVisibleInList);

  return (
    <div>
      <AutoHeader
        headerTitle={headerTitle}
        description=""
        componentId={`${componentId}CreateOrUpdate`}
        showCreateButton
        createUri={createUri}
      />
      <AutoTable
        records={records}
        metadata={metadata}
        headers={filteredHeaders}
        componentId={componentId}
        onPageNumberChange={onPageNumberChange}
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

import { publish } from '@/app/components/baseComponents/utils/pubSub';
import { ActionHandlersInterface, HeaderType, RecordType } from './types';

class ActionHandlers implements ActionHandlersInterface {
  private modelID: string;
  private apiEndpoint: string;
  private isSingle?: boolean;

  constructor(modelID: string, apiEndpoint: string, isSingle?: boolean) {
    this.modelID = modelID;
    this.apiEndpoint = apiEndpoint;
    this.isSingle = isSingle;
  }

  viewRecord = (record: RecordType, headers: HeaderType[]) => {
    console.log('Viewing record', record);
    
    const endpoint = (this.isSingle ? this.apiEndpoint : `${this.apiEndpoint}/${record.id}`).replace(/\/+/g, '/')
    publish(`${this.modelID}_View_setRecord`, {
      record,
      endpoint,
      method: 'GET',
      headers
    }); // Set the record to be shown

    publish(`${this.modelID}_View_showModal`, record); // Show modal for viewing
  };
  
  editRecord = (record: RecordType) => {
    console.log('Edit record', record);

    const endpoint = (this.isSingle ? this.apiEndpoint : `${this.apiEndpoint}/${record.id}`).replace(/\/+/g, '/')
    publish(`${this.modelID}_CreateOrUpdate_editRecord`, {
      record,
      endpoint,
      method: 'PUT',
    }); // Set the record to be edited

    publish(`${this.modelID}_CreateOrUpdate_showModal`, record); // Show modal for edit
  };

  updateRecordStatus = (record: RecordType) => {
    console.log('Updating status of record', record);

    const endpoint = (this.isSingle ? this.apiEndpoint : `${this.apiEndpoint}/${record.id}/status`).replace(/\/+/g, '/')
    publish(`${this.modelID}_UpdateStatus_setRecord`, {
      record,
      endpoint,
      method: 'PATCH',
    }); // Update the record status

    publish(`${this.modelID}_UpdateStatus_showModal`, record); // Show modal for status update
  };

  archiveRecord = (record: RecordType) => {
    console.log('Archiving record', record);

    const endpoint = (this.isSingle ? this.apiEndpoint : `${this.apiEndpoint}/${record.id}/archive`).replace(/\/+/g, '/')
    publish(`${this.modelID}_Archive_setRecord`, {
      record,
      endpoint,
      method: 'POST',
    }); // Archive the record

    publish(`${this.modelID}_Archive_showModal`, record); // Show modal for archiving
  };

  deleteRecord = (record: RecordType) => {
    console.log('Deleting record', record);

    const endpoint = (this.isSingle ? this.apiEndpoint : `${this.apiEndpoint}/${record.id}`).replace(/\/+/g, '/')
    publish(`${this.modelID}_Delete_setRecord`, {
      record,
      endpoint,
      method: 'DELETE',
    }); // Delete the record

    publish(`${this.modelID}_Delete_showModal`, record); // Show modal for deletion
  };
}

export default ActionHandlers;

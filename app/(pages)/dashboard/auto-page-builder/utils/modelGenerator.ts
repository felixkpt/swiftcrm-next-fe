// app/(pages)/dashboard/auto-page-builder/utils/modelGenerator.ts
import path from 'path';
import Pluralize from 'pluralize';
import { processTemplate, capitalize, inferTypeFromValue, getFieldsAndHeaders, getActionLabels } from './helpers';
import { createDirectoryIfNotExists, writeFileSync } from './fileOperations';
import { listPageTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/listPageTemplate';
import { getConstantsTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/getConstantsTemplate';
import { mapRecordsTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/mapRecordsTemplate';
import { typeTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/typeTemplate';
import { ActionLabelsActionsType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import { makeApiRequest } from './makeApiRequest';
import { singlePageTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/singlePageTemplate';
import { AutoPageBuilderType } from './backendTypes';

export async function saveAndGenerateModel(dataRaw: any) {
  'use server';
  console.log('dataRaw::', dataRaw)

  const { modelName, modelURI, fields: fieldsRaw, } = dataRaw;

  const { fields, headers } = getFieldsAndHeaders(fieldsRaw)
  const actionLabels = getActionLabels(dataRaw.actionLabels)

  const data: AutoPageBuilderType = dataRaw
  data.modelName = Pluralize(modelName)
  data.fields = fields
  data.headers = headers
  data.actionLabels = actionLabels

  // make be request if successful then continue
  const results = await makeApiRequest(data)

  if (results.ok) {
    generateModel(data, fields, modelName, modelURI)
  }

  return results

}

function generateModel(data: any, fields: any, modelName: string, modelURI: string) {
  const singularModelName = Pluralize.singular(modelName)

  try {
    const actionLabels: ActionLabelsActionsType | any = {}
    data.actionLabels.map((act: any) => {
      const key = act.key
      const actionType = act.actionType
      const label = act.label

      actionLabels[key] = { actionType, label }

    })
    
    data.actionLabels = actionLabels

    const processedListPage = processTemplate(listPageTemplate, data);
    const processedSinglePage = processTemplate(singlePageTemplate, data);
    const processedGetConstants = processTemplate(getConstantsTemplate, data);
    const processedMapRecords = processTemplate(mapRecordsTemplate, data);

    const typeDefinitions = fields.reduce((prev: string[], field: any) => {
      const typeValues = inferTypeFromValue(field.defaultValue);
      prev.push(`${field.name}: ${typeValues};`);
      return prev;
    }, []);

    const typeContent = typeTemplate
      .replace(/{autoPageBuilder_typeName}/g, capitalize(singularModelName) + 'Type')
      .replace('{autoPageBuilder_typeValues}', typeDefinitions.join('\n  '));

    const listDirPath = path.join(process.cwd(), 'app', '(pages)', modelURI);

    // Split the modelURI by '/' and get the last segment
    const segments = modelURI.split('/');
    const lastSegment = segments[segments.length - 1];
    // Ensure the last segment is singular
    const lastWordSingular = Pluralize.singular(lastSegment);
    const singleDirPath = path.join(process.cwd(), 'app', '(pages)', modelURI, `[${lastWordSingular}]`);

    const autoModelPath = path.join(listDirPath, 'AutoModel');

    createDirectoryIfNotExists(listDirPath);
    createDirectoryIfNotExists(singleDirPath);
    createDirectoryIfNotExists(autoModelPath);

    writeFileSync(path.join(listDirPath, 'page.tsx'), processedListPage);
    writeFileSync(path.join(singleDirPath, 'page.tsx'), processedSinglePage);
    writeFileSync(path.join(autoModelPath, 'getConstants.ts'), processedGetConstants);
    writeFileSync(path.join(autoModelPath, 'mapRecords.tsx'), processedMapRecords);
    writeFileSync(path.join(autoModelPath, 'types.ts'), typeContent);

  } catch (error) {
    console.error('Error generating model files:', error);
  }

}

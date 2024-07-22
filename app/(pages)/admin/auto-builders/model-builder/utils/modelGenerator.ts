import path from 'path';
import Pluralize from 'pluralize';
import simpleGit from 'simple-git';
import { processTemplate, inferTypeFromValue, getFieldsAndHeaders, getActionLabels } from './helpers';
import { createDirectoryIfNotExists, writeFileSync } from './fileOperations';
import { listPageTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/listPageTemplate';
import { getConstantsTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/getConstantsTemplate';
import { mapRecordsTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/mapRecordsTemplate';
import { typeTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/AutoModel/typeTemplate';
import { ActionLabelsActionsType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import { makeApiRequest } from './makeApiRequest';
import { singlePageTemplate } from '@/app/components/baseComponents/Autos/AutoPageBuilderTemplate/singlePageTemplate';
import { AutoPageBuilderType } from './backendTypes';
import { startCase, camelCase } from 'lodash';

export async function saveAndGenerateModel(dataRaw: any) {
  'use server';
  // console.log('dataRaw::', dataRaw)

  const { modelDisplayName, modelURI, fields: fieldsRaw, } = dataRaw;

  const { fields, headers } = getFieldsAndHeaders(fieldsRaw)
  const actionLabels = getActionLabels(dataRaw.actionLabels)

  const data: AutoPageBuilderType = dataRaw
  data.modelDisplayName = Pluralize(modelDisplayName)

  const { nameSingular, namePlural, className } = getModelNames(modelDisplayName)

  data.name_singular = nameSingular
  data.name_plural = namePlural
  data.class_name = className

  data.fields = fields
  data.headers = headers
  data.actionLabels = actionLabels

  // make be request if successful then continue
  const results = await makeApiRequest(data)

  if (results.ok) {
    generateModel(data, fields, modelURI, dataRaw.id)
  }

  return results

}

async function generateModel(data: any, fields: any, modelURI: string, id: number | null) {
  const actionType = id === null ? 'create' : 'edit';
  const git = simpleGit();

  try {
    const actionLabels: ActionLabelsActionsType | any = {}
    data.actionLabels.map((act: any) => {
      const key = act.key
      const actionType = act.actionType
      const label = act.label

      actionLabels[key] = { actionType, label }
    })

    data.actionLabels = actionLabels
    console.log('print::', data)

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
      .replace(/{autoPageBuilder_typeName}/g, data.class_name + 'Type')
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

    // Add and commit changes
    await git.add('.');
    const commitMessage = `Autobuilders > model-builder: ${actionType} ${data.modelDisplayName.toLowerCase()} model and related files`;
    await git.commit(commitMessage);

  } catch (error: any) {
    console.error('Error generating model files:', error);

    // Stash changes if any step fails
    try {
      const stashMessage = `Autobuilders > model-builder: Stash changes due to ${actionType} failure - ${error.message}`;
      await git.stash(['push', '-m', stashMessage]);
      console.log(`Changes stashed: ${stashMessage}`);
    } catch (stashError) {
      console.error('Error stashing changes:', stashError);
    }
  }

}

// Custom string manipulation functions
const STR = {
  slug: (str: string) => str.toLowerCase().replace(/ /g, '_'),
  pascal: (str: string) => startCase(camelCase(str)).replace(/ /g, '')
};

function getModelNames(modelName: string) {

  // Singularize the model_name if possible, otherwise use as is
  const singularized = Pluralize.singular(modelName);
  const nameSingular = singularized || modelName;

  // Generate class name from the singular name in PascalCase
  const className = STR.pascal(nameSingular);

  // Pluralize the singular model name to generate pluralized version
  const namePlural = Pluralize.plural(nameSingular);

  return { nameSingular, namePlural, className };
}

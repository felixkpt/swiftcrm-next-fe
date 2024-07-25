// app/(pages)/admin/auto-builders/model-builder/utils/makeApiRequest.ts
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { revalidateTag } from 'next/cache'
import getConstants from '../AutoModel/getConstants';


type ResultsType = {
  data: null,
  message: string | undefined,
  error: any,
  status: undefined | number,
  statusText: string | undefined,
  ok: boolean
}

  // Destructure constants from getConstants
  const {
    MODEL_ID,
    API_ENDPOINT,
  } = getConstants;


const uri = API_ENDPOINT

export async function makeApiRequest(data: any) {
  data = {...data}
  return genericRequestor(uri, data)

}

async function genericRequestor(endPoint: string, data: any) {
  const pageId = data?.pageId
  endPoint = pageId ? `${endPoint}/${pageId}` : endPoint

  console.log('DATA::', JSON.stringify(data))

  const results: ResultsType = {
    data: null,
    message: undefined,
    error: undefined,
    status: undefined,
    statusText: undefined,
    ok: false,
  }

  try {
    await fetch(appConfig.api.url(endPoint), {
      method: pageId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => {

      results.status = response.status
      results.statusText = response.statusText
      results.message = response.statusText
      if (results.status == 200 || results.status == 201) {
        results.ok = true
      }
      // revalidateTag `MODEL_ID`
      revalidateTag(MODEL_ID)
      return response.json()
    })
      .then((data) => {
        results.data = data
      })
      .catch((error) => {
        results.error = error
      });

  } catch (error) {
    results.error = error
  }

  return results

}

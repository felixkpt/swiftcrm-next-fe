// app/(pages)/dashboard/auto-page-builder/utils/makeApiRequest.ts
import { formatErrors } from '@/app/components/baseComponents/utils/formatErrors';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';


type ResultsType = {
  data: null,
  message: string | undefined,
  error: any,
  status: undefined | number,
  statusText: string | undefined,
  ok: boolean
}

export async function makeApiRequest(data: any) {

  return genericRequestor('dashboard/auto-page-builder', data)

}

async function genericRequestor(endPoint: string, data: any) {
  const pageId = data?.pageId
  endPoint = pageId ? `${endPoint}/${pageId}` : endPoint

  console.log('DDDD::', JSON.stringify(data))

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

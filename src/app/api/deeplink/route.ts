import { getLtikAuthHeader } from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  const resourceid = request.headers.get('x_resourceid') as string;
  console.log('x_ltik', x_ltik, getLtikAuthHeader(x_ltik));
  console.log('resourceid', resourceid);
  const url = `${process.env.LTIAAS_URL}/api/deeplinking/form`;

  const payload = {
    contentItems: [
      {
        type: 'ltiResourceLink',
        url: `${process.env.LTIAAS_URL}/lti/launch?resourceid=${resourceid}`,
        title: 'Resource',
        lineItem: {
          scoreMaximum: 100,
          resourceId: resourceid,
        },
      },
    ],
    options: {
      message: 'Deep Linking successful!',
      log: 'deep_linking_successful',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLtikAuthHeader(x_ltik),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return Response.json({ data });
}

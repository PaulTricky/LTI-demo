import {
  getLtikAuthHeader,
  getServiceAuthHeader,
} from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  const x_resourceId = request.headers.get('x_resourceId') as string;
  const x_resourceLinkId = request.headers.get('x_resourceLinkId') as string;
  // console.log('x_ltik', x_ltik, getServiceAuthHeader(x_ltik));
  let url = `${process.env.LTIAAS_URL}/api/lineitems/?`;

  if (x_resourceId) {
    url += `resourceId=${x_resourceId}`;
  }

  if (x_resourceLinkId) {
    url += `resourceLinkId=${x_resourceLinkId}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLtikAuthHeader(x_ltik),
    },
  });

  const data = await res.json();

  return Response.json({ data });
}

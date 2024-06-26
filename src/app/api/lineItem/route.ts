import {
  getLtikAuthHeader,
  getServiceAuthHeader,
} from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  // console.log('x_ltik', x_ltik, getServiceAuthHeader(x_ltik));
  const url = `${process.env.LTIAAS_URL}/api/lineitems`;

  const payload = await request.json();

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

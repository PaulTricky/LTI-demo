import { getLtikAuthHeader } from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  console.log('x_ltik', x_ltik, getLtikAuthHeader(x_ltik));
  const url = `${process.env.LTIAAS_URL}/api/idtoken`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLtikAuthHeader(x_ltik),
    },
  });
  const data = await res.json();

  return Response.json({ data });
}

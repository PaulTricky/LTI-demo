import { getLtikAuthHeader } from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  const x_line_item_id = request.headers.get('x_line_item_id') as string;
  const encoded_id = encodeURIComponent(x_line_item_id);
  const url = `${process.env.LTIAAS_URL}/api/lineitems/${encoded_id}/scores`;

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

import { getLtikAuthHeader } from '@/app/configs/serverConfig';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const x_ltik = searchParams.get('x_ltik') as string;
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

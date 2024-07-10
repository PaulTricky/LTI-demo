import { getLtikAuthHeader } from '@/app/configs/serverConfig';
import { NextRequest } from 'next/server';
import { ResourceController } from '@/app/lti/launch/controller/resourceController';
import { api } from '@/app/lib/remultInit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  const x_line_item_id = request.headers.get('x_line_item_id') as string;
  const x_resourceid = request.headers.get('x_resourceid') as string;
  const encoded_id = encodeURIComponent(x_line_item_id);
  const url = `${process.env.LTIAAS_URL}/api/lineitems/${encoded_id}/scores`;

  const payload = await request.json();

  const { answers, ...other } = payload;
  const userAnswers = JSON.parse(answers);

  const resource = await api.withRemult(async () => {
    return ResourceController.getResourceById(x_resourceid);
  });

  console.log('payload', payload);

  const allQuestions: any = resource?.sections?.reduce((sum: any, cur: any) => {
    sum += cur?.questions?.length || 0;
    return sum;
  }, 0);

  let correctQuestions = 0;

  resource?.sections?.forEach((section: any) => {
    section?.questions?.forEach((question: any) => {
      const correctAnswers = question?.choices
        ?.filter((e: any) => e.correct === '1')
        ?.map((e: any) => e.title);
      if (
        userAnswers[question?.id]?.length > 0 &&
        userAnswers[question?.id]?.sort?.()?.join?.(',') ===
          correctAnswers?.sort?.()?.join?.(',')
      ) {
        correctQuestions += 1;
      }
    });
  });

  console.log('correctQuestions', correctQuestions, allQuestions);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLtikAuthHeader(x_ltik),
    },
    body: JSON.stringify({
      ...other,
      scoreGiven: (correctQuestions / allQuestions) * 100,
    }),
  });

  try {
    const data = await res.json();
    console.log('>=== **', data);
    return Response.json({ data });
  } catch (e) {
    return Response.json({ data: e });
  }
}

export async function GET(request: NextRequest) {
  const x_ltik = request.headers.get('x_ltik') as string;
  const x_line_item_id = request.headers.get('x_line_item_id') as string;
  const x_user_id = request.headers.get('x_user_id') as string;
  const encoded_id = encodeURIComponent(x_line_item_id);
  const url = `${process.env.LTIAAS_URL}/api/lineitems/${encoded_id}/scores?userId=${x_user_id}`;

  console.log('url get score', url);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLtikAuthHeader(x_ltik),
    },
  });

  const data = await res.json();

  return Response.json({ data });
}

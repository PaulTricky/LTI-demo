'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PreviewForm = ({
  token,
  loading,
  question,
}: {
  token: any;
  loading: boolean;
  question: any;
}) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const lineItemId = useMemo(() => token?.launch?.lineItemId, []);

  console.log("lineItemId", lineItemId)
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const ltik = searchParams.get('ltik');

  const getLineItems = async () => {
    try {
      const res = await axios(`/api/lineItems`, {
        method: 'GET',
        headers: {
          x_ltik: ltik,
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  const submitAnswer = async () => {
    console.log('answers', answers);
    try {

    let _lineItemId = lineItemId;
    if (!_lineItemId) {
      const lineItem = await createLineItem();
      _lineItemId = lineItem?.data?.id;
    }

    const data = await submitScore(_lineItemId);

    console.log("data", data);

    return toast({
      description: 'Submit score success',
    })
    // console.log("getLineItem", getLineItem);
  }
 catch(e) {
  console.log("submit error", e);
  return toast({
    description: 'Failed',
    variant: 'destructive'
  })
 }
  };

  const getLineItemByResourceID = async () => {
    const ltik = searchParams.get('ltik');

    try {
      const resourceLinkId = token?.launch?.resourceLink?.id;
      const resourceId = token?.launch?.resource?.id;
      const res = await axios(`/api/lineItems`, {
        method: 'GET',
        headers: {
          x_ltik: ltik,
          x_resourceId: resourceId,
          x_resourceLinkId: resourceLinkId,
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  const createLineItem = async () => {
    const ltik = searchParams.get('ltik');

    try {
      const resourceLinkId = token?.launch?.resourceLink?.id;
      const resourceId = token?.launch?.resource?.id;
      const res = await axios(`/api/lineItem`, {
        method: 'POST',
        headers: {
          x_ltik: ltik,
        },
        data: {
          label: 'Exercise 1',
          scoreMaximum: 100,
          resourceId,
          tag: 'grade',
          resourceLinkId,
          gradesReleased: true,
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  const getSubmitScore = async () => {
    const ltik = searchParams.get('ltik');

    try {
        await axios(`/api/scores`, {
        method: 'GET',
        headers: {
          x_ltik: ltik,
          x_line_item_id: lineItemId,
          x_user_id: token?.user?.id, 
        },
      });
    } catch(e) {

    }
  }

  const submitScore = async (lineItemId: string) => {
    const ltik = searchParams.get('ltik');
    try {
      const res = await axios(`/api/scores`, {
        method: 'POST',
        headers: {
          x_ltik: ltik,
          x_line_item_id: lineItemId,
        },
        data: {
          userId: token?.user?.id, 
          activityProgress: "Completed", 
          gradingProgress: "FullyGraded", 
          scoreGiven: 95, 
          comment: "user submit" 
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  return (
    <TooltipProvider>
      <header className='w-full fixed top-0 z-10 justify-between flex h-[53px] items-center gap-1 border-b bg-background px-4'>
        <h1 className='text-xl font-semibold'>Question 1</h1>
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            type='button'
            size='sm'
            className='gap-1.5 text-sm'
            onClick={getLineItems}
          >
            Get Line Items
          </Button>
          <Button
            variant='secondary'
            type='button'
            size='sm'
            className='gap-1.5 text-sm'
            onClick={createLineItem}
          >
            Create Line Item
          </Button>
          <Button
            variant='secondary'
            type='button'
            size='sm'
            className='gap-1.5 text-sm'
            onClick={getLineItemByResourceID}
          >
            Get Line Item By Resource
          </Button>
          <Button
            variant='secondary'
            type='button'
            size='sm'
            className='gap-1.5 text-sm'
            onClick={getSubmitScore}
>
            Get Submit score
          </Button>
        </div>
      </header>
      <div className='grid h-screen w-full pt-[53px] pl-[53px]'>
        <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
          <nav className='grid gap-1 p-2'>
            <Tooltip key={question?.id}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-lg bg-muted'
                  aria-label='Playground'
                >
                  1
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                {question?.question}
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className='flex flex-col'>
          <main className='gap-4 overflow-auto p-4 py-10'>
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full rounded-lg border'
            >
              <ResizablePanel defaultSize={60}>
                <div className='relative flex-col flex items-center justify-center gap-8 p-4 pt-12'>
                  <div className='whitespace-pre-wrap text-sm w-full'>
                    {question?.description}
                  </div>
                  <iframe
                    width='100%'
                    height='300px'
                    src={question?.embedLink}
                    className='max-w-[300px]'
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40}>
                <div className='w-full  gap-4 relative flex h-full items-start min-h-[50vh] flex-col rounded-xl p-4 pt-12'>
                  <div className='whitespace-pre-wrap text-xl font-bold'>
                    {question?.question}
                  </div>
                  <RadioGroup defaultValue='comfortable'>
                    {question?.choices?.map((choice: any) => {
                      return (
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            checked={answers?.includes(choice.title)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setAnswers((answers) => [
                                    ...answers,
                                    choice.title,
                                  ])
                                : setAnswers((answers) =>
                                    answers?.filter(
                                      (value) => value !== choice.title
                                    )
                                  );
                            }}
                            value={choice?.title}
                            id='r1'
                          />
                          <Label htmlFor='r1'>{choice?.title}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <div>
                    <Button
                      variant={'ghost'}
                      type='button'
                      className='p-2 h-auto ml-[-8px] p-2 bg-[#2d88bc] text-xs text-white rounded-md mr-2'
                      onClick={submitAnswer}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PreviewForm;

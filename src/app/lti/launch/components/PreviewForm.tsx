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
import { RadioGroup } from '@/components/ui/radio-group';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Resource } from '@/models/resource';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClock, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IframeLink from './iframe';
import { Question } from '@/models/question';

const PreviewForm = ({
  token,
  loading,
  resource,
  questionMap,
  setQuestionMap,
  resourceid,
}: {
  token: any;
  resourceid: string | null;
  loading: boolean;
  resource?: Resource;
  setQuestionMap: any;
  questionMap: Record<string, number>;
}) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const lineItemId = useMemo(() => token?.launch?.lineItemId, []);
  console.log('lineItemId', lineItemId);
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
        console.log("lineItem", lineItem);
        _lineItemId = lineItem?.id;
      }

      const data = await submitScore(_lineItemId);

      console.log('data', data);

      return toast({
        description: 'Submit score success',
      });
      // console.log("getLineItem", getLineItem);
    } catch (e) {
      console.log('submit error', e);
      return toast({
        description: 'Failed',
        variant: 'destructive',
      });
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
    } catch (e) {}
  };

  const submitScore = async (lineItemId: string) => {
    const ltik = searchParams.get('ltik');
    try {
      const res = await axios(`/api/scores`, {
        method: 'POST',
        headers: {
          x_ltik: ltik,
          x_line_item_id: lineItemId,
          x_resourceid: resourceid,
        },
        data: {
          userId: token?.user?.id,
          activityProgress: 'Completed',
          gradingProgress: 'FullyGraded',
          // scoreGiven: 95,
          answers: JSON.stringify(answers),
          comment: 'user submit',
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  console.log('selectedSection', resource);
  console.log('questionMap', questionMap);

  if ((!token || !resource?.sections?.length))
    return (
      <div
        style={
          {
            // background: 'radial-gradient(#cee00f, #89d12d)',
          }
        }
        className='p-8'
      >
        <img
          src='/images/background.jpg'
          className='absolute top-0 left-0 w-full h-full'
        />
        <div className='absolute left-1/2 top-1/2 text-white'>
          Loading Question...
        </div>
      </div>
    );

  // const getExerciseDone = useCallback((section: Section) => {
  // return section?.questions?.every(question => !!(answers[question?.id]?.length > 0))
  // }, [answers])
  

  return (
    <div className='p-8 max-w-[900px] mx-auto'>
      <Tabs className='w-auto' defaultValue={resource?.sections?.[0]?.id}>
        <img
          src='/images/background.jpg'
          className='absolute top-0 left-0 w-full h-full'
        />
        <div className='h-screen flex flex-col justify-center items-start gap-4'>
          <div className='flex justfy-between items-center bg-white relative w-full gap-4'>
            <div className='w-full'>
              <TabsList
                className={`h-[50px] inline-flex items-center text-muted-foreground w-full justify-start rounded-none border-b bg-white`}
              >
                {resource?.sections?.map((section, index) => {
                  const isExerciseDone = section?.questions?.every(
                    (question) => !!(answers[question?.id]?.length > 0)
                  );

                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className='inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none'
                    >
                      <div className='flex p-0 gap-1 items-center'>
                        Exercise {index + 1}{' '}
                        {isExerciseDone && (
                          <Check className='w-4 h-4 text-green-600' />
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className='pr-4 flex items-center gap-4'>
              <Button
                variant={'default'}
                className='rounded-xl'
                onClick={() => {
                  const answersLength = Object.values(answers)?.filter(
                    (e) => e?.length > 0
                  )?.length;

                  const allQuestions = resource?.sections?.reduce(
                    (sum, cur) => {
                      sum += cur?.questions?.length || 0;
                      return sum;
                    },
                    0
                  );

                  if (answersLength !== allQuestions) {
                    return toast({
                      title: 'Please complete all exercises',
                      variant: 'destructive',
                    });
                  }

                  submitAnswer();
                }}
              >
                Submit Course
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
          </div>
          {resource?.sections?.map((section: any, index) => {
            const selectedSection = section;
            const selectedQuestion = questionMap[section?.id as string];
            return (
              <TabsContent value={section?.id} className='w-full'>
                <div className='flex w-[70%] gap-10 mx-auto relative z-10 w-full justify-center'>
                  <div className='w-[250px] bg-white px-4 flex flex-col justify-between'>
                    <div>
                      {/* <div className='text-center py-5'>Section 1</div> */}
                      <Separator />
                      <div className='py-4'>
                        <div className='text-center text-3xl text-[#2d88bc]'>
                          29:12
                        </div>
                        <div className='text-base flex items-center justify-center gap-1 mt-2'>
                          <AlarmClock className='w-6 h-6' />
                          Time Left
                        </div>
                      </div>
                      {/* <div className='text-center text-base mb-4'>Question: {selectedSection?.questions?.length}</div> */}
                      <Separator />
                      <div className='my-4 flex items-center flex-col'>
                        <div className='text-center font-medium'>
                          Question Sheet
                        </div>
                        <div className='text-center font-medium mt-4 flex flex-wrap gap-2'>
                          {selectedSection?.questions?.map(
                            (question: Question, index: number) => {
                              return (
                                <div
                                  onClick={() => {
                                    setQuestionMap((questionMap: any) => {
                                      const clone =
                                        structuredClone(questionMap);
                                      clone[selectedSection?.id as string] =
                                        index;
                                      return clone;
                                    });
                                  }}
                                  key={question.id}
                                  className={cn(
                                    'w-[30px] h-[30px] rounded-md border flex items-center justify-center cursor-pointer',
                                    index === selectedQuestion
                                      ? 'bg-[#2d88bc] text-white'
                                      : ''
                                  )}
                                >
                                  {index + 1}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='my-4 flex flex-col items-center'>
                      <div className='text-sm text-muted-foreground'>
                        Total Question: {selectedSection?.questions?.length}
                      </div>
                    </div>
                  </div>
                  <div className='w-full p-4 bg-white'>
                    <div className='flex flex-col gap-4 text-xl'>
                      {loading ? (
                        <Skeleton className='w-full h-[300px]' />
                      ) : (
                        <IframeLink embedLink={section?.embedLink} />
                      )}
                      {loading ? (
                        <Skeleton className='w-full h-[28px]' />
                      ) : (
                        <div className='text-xs text-center'>
                          {section?.description}
                        </div>
                      )}
                      <div className='flex items-center w-full flex-wrap gap-2'>
                        <div className='text-[#2d88bc] font-bold'>
                          {selectedQuestion + 1}.
                        </div>
                        {loading ? (
                          <Skeleton className='w-full h-[28px]' />
                        ) : (
                          <div className='text-xl font-medium'>
                            {section?.questions?.[selectedQuestion]?.title}
                          </div>
                        )}
                      </div>
                      <div>
                        <RadioGroup
                          defaultValue='comfortable'
                          className='grid grid-cols-2'
                        >
                          {section?.questions?.[selectedQuestion]?.choices?.map(
                            (choice: any, index: number) => {
                              const questionId =
                                section?.questions?.[selectedQuestion]?.id;
                              return (
                                <div
                                  className='flex items-center space-x-2 p-4 border rounded-md hover:border-[#2d88bc] cursor-pointer group'
                                  onClick={() => {
                                    const checkboxEl = document.querySelector(
                                      `button#choice-${index}`
                                    ) as HTMLElement;
                                    checkboxEl.click();
                                  }}
                                >
                                  <Checkbox
                                    checked={
                                      !!answers?.[questionId]?.includes(
                                        choice?.title
                                      )
                                    }
                                    className='group-hover:bg-white'
                                    onCheckedChange={(checked) => {
                                      console.log(
                                        'question',
                                        section?.questions?.[selectedQuestion],
                                        choice?.title
                                      );
                                      const _answersClone =
                                        structuredClone(answers);
                                      if (checked) {
                                        if (!_answersClone[questionId]) {
                                          _answersClone[questionId] = [
                                            choice?.title,
                                          ];
                                        } else {
                                          if (
                                            !_answersClone[
                                              questionId
                                            ]?.includes?.(choice?.title)
                                          ) {
                                            _answersClone[questionId].push(
                                              choice?.title
                                            );
                                          }
                                        }
                                      } else {
                                        const index = _answersClone[
                                          questionId
                                        ]?.findIndex(
                                          (e) => e === choice?.title
                                        );

                                        if (index !== -1) {
                                          _answersClone[questionId]?.splice(
                                            index,
                                            1
                                          );
                                        }
                                      }

                                      setAnswers(_answersClone);
                                      //
                                      // return checked
                                      // ? setAnswers((answers) => [
                                      // ...answers,
                                      // choice?.title,
                                      // ])
                                      // : setAnswers((answers) =>
                                      // answers?.filter(
                                      // (value) => value !== choice?.title
                                      // )
                                      // );
                                    }}
                                    value={choice?.title}
                                    id={`choice-${index}`}
                                  />
                                  <Label htmlFor='r1'>{choice?.title}</Label>
                                </div>
                              );
                            }
                          )}
                        </RadioGroup>
                      </div>
                      <div className='flex items-center justify-between mt-4'>
                        {selectedQuestion - 1 >= 0 ? (
                          <Button
                            onClick={() => {
                              setQuestionMap((questionMap: any) => {
                                const clone = structuredClone(questionMap);
                                clone[selectedSection?.id as string] =
                                  selectedQuestion - 1;
                                return clone;
                              });
                            }}
                            className='rounded-full p-0 m-0 h-[32px] w-[32px]'
                            variant={'outline'}
                            size={'sm'}
                          >
                            <ArrowLeft className='h-4 h-4' />
                          </Button>
                        ) : (
                          <div className='w-[32px] h-[32px]'></div>
                        )}
                        {selectedQuestion + 1 < section?.questions?.length ? (
                          <Button
                            className='rounded-full p-0 m-0 h-[32px] w-[32px]'
                            variant={'outline'}
                            size={'sm'}
                            onClick={() => {
                              setQuestionMap((questionMap: any) => {
                                const clone = structuredClone(questionMap);
                                clone[section?.id as string] =
                                  selectedQuestion + 1;
                                return clone;
                              });
                            }}
                          >
                            <ArrowRight className='h-4 h-4' />
                          </Button>
                        ) : (
                          <div className='w-[32px] h-[32px]'></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  );

  // return (
  // <TooltipProvider>
  {
    /* <header className='w-full fixed top-0 z-10 justify-between flex h-[53px] items-center gap-1 border-b bg-background px-4'> */
  }
  {
    /* <h1 className='text-xl font-semibold'>Question 1</h1> */
  }
  {
    /* <div className='flex items-center gap-2'> */
  }
  {
    /* <Button */
  }
  // variant='secondary'
  // type='button'
  // size='sm'
  // className='gap-1.5 text-sm'
  // onClick={getLineItems}
  // >
  {
    /* Get Line Items */
  }
  {
    /* </Button> */
  }
  {
    /* <Button */
  }
  // variant='secondary'
  // type='button'
  // size='sm'
  // className='gap-1.5 text-sm'
  // onClick={createLineItem}
  // >
  {
    /* Create Line Item */
  }
  {
    /* </Button> */
  }
  {
    /* <Button */
  }
  // variant='secondary'
  // type='button'
  // size='sm'
  // className='gap-1.5 text-sm'
  // onClick={getLineItemByResourceID}
  // >
  {
    /* Get Line Item By Resource */
  }
  {
    /* </Button> */
  }
  {
    /* <Button */
  }
  // variant='secondary'
  // type='button'
  // size='sm'
  // className='gap-1.5 text-sm'
  // onClick={getSubmitScore}
  // >
  {
    /* Get Submit score */
  }
  {
    /* </Button> */
  }
  {
    /* </div> */
  }
  {
    /* </header> */
  }
  {
    /* <div className='grid h-screen w-full pt-[53px] pl-[53px]'> */
  }
  {
    /* <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'> */
  }
  {
    /* <nav className='grid gap-1 p-2'> */
  }
  {
    /* <Tooltip key={question?.id}> */
  }
  {
    /* <TooltipTrigger asChild> */
  }
  {
    /* <Button */
  }
  // variant='ghost'
  // size='icon'
  // className='rounded-lg bg-muted'
  // aria-label='Playground'
  // >
  {
    /* 1 */
  }
  {
    /* </Button> */
  }
  {
    /* </TooltipTrigger> */
  }
  {
    /* <TooltipContent side='right' sideOffset={5}> */
  }
  {
    /* {question?.question} */
  }
  {
    /* </TooltipContent> */
  }
  {
    /* </Tooltip> */
  }
  {
    /* </nav> */
  }
  {
    /* </aside> */
  }
  {
    /* <div className='flex flex-col'> */
  }
  {
    /* <main className='gap-4 overflow-auto p-4 py-10'> */
  }
  {
    /* <ResizablePanelGroup */
  }
  // direction='horizontal'
  // className='w-full rounded-lg border'
  // >
  {
    /* <ResizablePanel defaultSize={60}> */
  }
  {
    /* <div className='relative flex-col flex items-center justify-center gap-8 p-4 pt-12'> */
  }
  {
    /* <div className='whitespace-pre-wrap text-sm w-full'> */
  }
  {
    /* {question?.description} */
  }
  {
    /* </div> */
  }
  {
    /* <iframe */
  }
  // width='100%'
  // height='300px'
  // src={question?.embedLink}
  // className='max-w-[300px]'
  // />
  {
    /* </div> */
  }
  {
    /* </ResizablePanel> */
  }
  {
    /* <ResizableHandle withHandle /> */
  }
  {
    /* <ResizablePanel defaultSize={40}> */
  }
  {
    /* <div className='w-full  gap-4 relative flex h-full items-start min-h-[50vh] flex-col rounded-xl p-4 pt-12'> */
  }
  {
    /* <div className='whitespace-pre-wrap text-xl font-bold'> */
  }
  {
    /* {question?.question} */
  }
  {
    /* </div> */
  }
  {
    /* <RadioGroup defaultValue='comfortable'> */
  }
  {
    /* {question?.choices?.map((choice: any) => { */
  }
  // return (
  // <div className='flex items-center space-x-2'>
  {
    /* <Checkbox */
  }
  // checked={answers?.includes(choice.title)}
  // onCheckedChange={(checked) => {
  // return checked
  // ? setAnswers((answers) => [
  // ...answers,
  // choice.title,
  // ])
  // : setAnswers((answers) =>
  // answers?.filter(
  // (value) => value !== choice.title
  // )
  // );
  // }}
  // value={choice?.title}
  // id='r1'
  // />
  {
    /* <Label htmlFor='r1'>{choice?.title}</Label> */
  }
  {
    /* </div> */
  }
  // );
  // })}
  {
    /* </RadioGroup> */
  }
  {
    /* <div> */
  }
  {
    /* <Button */
  }
  // variant={'ghost'}
  // type='button'
  // className='p-2 h-auto ml-[-8px] p-2 bg-[#2d88bc] text-xs text-white rounded-md mr-2'
  // onClick={submitAnswer}
  // >
  {
    /* Submit Answer */
  }
  {
    /* </Button> */
  }
  {
    /* </div> */
  }
  {
    /* </div> */
  }
  {
    /* </ResizablePanel> */
  }
  {
    /* </ResizablePanelGroup> */
  }
  {
    /* </main> */
  }
  {
    /* </div> */
  }
  {
    /* </div> */
  }
  {
    /* </TooltipProvider> */
  }
  // );
};

export default PreviewForm;

'use client';

import { DeepLinkForm } from './components/Topbar';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { defaultValues, validationSchema } from './data';
import { Form, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Question } from '@/models/question';
import { useEffect, useState } from 'react';
import { remult } from 'remult';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import InnerHTML from 'dangerously-set-html-content';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Plus, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import InputForm from '@/components/Form/Input';
import TextAreaForm from '@/components/Form/TextArea';
import { Skeleton } from '@/components/ui/skeleton';
import { Section } from '@/models/section';
import { Resource } from '@/models/resource';

const sectionRepo = remult.repo(Section);
const questionRepo = remult.repo(Question);
const resourceRepo = remult.repo(Resource);
const DeepLink = () => {
  const searchParams = useSearchParams();
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultValues,
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [parseStr, setParseStr] = useState('');
  const [active, setActive] = useState<number | null>(null);

  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<any>({
      control: form.control,
      name: 'section',
    });
  console.log('form', form, form.watch());
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    sectionRepo.find({
      include: {
        questions: true
      }
    }).then((e) => {
      console.log("e ***", e)
    });
  }, []);

  const sendDeepLinkToLTIAAS = async (resourceid: string) => {
    const ltik = searchParams.get('ltik');

    try {
      const res = await axios(`/api/deeplink`, {
        method: 'GET',
        headers: {
          x_ltik: ltik,
          x_resourceid: resourceid,
        },
      });
      return res.data.data;
    } catch (e) {
      console.log('eeeee', e);
      return null;
    }
  };

  const createLineItem = async (
    title: string,
    resourceId: string,
    resourceLinkId: string
  ) => {
    const ltik = searchParams.get('ltik');

    try {
      const res = await axios(`/api/lineItem`, {
        method: 'POST',
        headers: {
          x_ltik: ltik,
        },
        data: {
          label: title,
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

  const onSubmit = async (values: any) => {
    try {

    
    console.log('submit', values);
    // const multipleChoice = values?.multiple;

    setLoading(true);
// 
    // const correctChoiceLength = values?.choices?.filter(
      // (e: any) => e.correct === '1'
    // )?.length;
// 
    // if (correctChoiceLength < 1) {
      // setLoading(false);
      // return toast({
        // description: 'Please select at least 1 correct choice',
      // });
    // }

    // if (!multipleChoice && correctChoiceLength > 1) {
      // setLoading(false);
      // return toast({
        // description: 'Please select 1 correct for single choice',
      // });
    // }
    console.log("values", values);

    const newResource = await resourceRepo.save({});

    values?.section.forEach((sec: any) => {
      resourceRepo.relations(newResource).sections.save({ description: sec?.description, embedLink: sec?.embedLink  }).then(section => {
        sectionRepo.relations(section).questions.save(sec.questions);
      })
    })


    const formData = await sendDeepLinkToLTIAAS(newResource.id);
    const resourceLinkId = `/lti/launch?resourceid=${newResource.id}`;
    const resourceId = newResource.id;
    const item = await createLineItem(
      values?.title,
      resourceId,
      resourceLinkId
    );
    console.log('item', item);

    if (formData?.form) {
      setTimeout(() => {
        alert(1);
        setParseStr(formData?.form);
      }, 10000);
    }

    setLoading(false);
    form.reset();
  } catch(e) {
    setLoading(false);
  }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex gap-4 flex-col'
        >
          <header className='w-full fixed top-0 z-10 justify-between flex h-[53px] items-center gap-1 border-b bg-background px-4'>
            <h1 className='text-xl font-semibold'>
              Question Studio
            </h1>
            <div className='flex items-center gap-2'>
              <Button type="button" onClick={() => {
                try {
                  const el = document.querySelector(`#add-question-${active}`) as HTMLElement;
                  el.click();
                  setTimeout(() => {
                    const lastItem = document.querySelector('div[data-last="true"]') as HTMLElement;
                    lastItem.scrollIntoView();
                  }, 100)
                } catch(e) {}
              }}>
                Add Question
              </Button>
              <Button
                variant='ghost'
                type='submit'
                size='sm'
                className='bg-[#2d88bc] text-white gap-1.5 text-sm'
                disabled={loading}
              >
                {loading ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className={cn('mr-2 h-4 w-4 animate-spin')}
                  >
                    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                  </svg>
                ) : (
                  <Send className='size-3.5' />
                )}
                Create Question
              </Button>
            </div>
          </header>
          <div className='flex gap-8 h-screen w-full pt-[53px] pl-[216px] pr-4'>
            <aside className='p-4 w-[200px]  inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
              <nav className='flex flex-col gap-5'>
                {fields?.map((field, index: number) => (
                  <div className={cn("cursor-pointer p-4", active === index ? 'bg-[#77cc334d]' : '')} onClick={() => setActive(index)}>
                    <div className="text-base font-medium"></div>
                    <Skeleton className="h-[80px] w-full rounded-xl flex justify-center items-center text-xl">{index + 1}</Skeleton>
                </div>
                ))}
              </nav>
              <Button
              variant='ghost'
              type="button"
              className='mt-4 bg-[#2d88bc] text-white gap-1.5 text-sm w-[80%] mx-auto'
               onClick={() => append({})}>
                 Add Section
              </Button>
            </aside>
              <div className="w-full">
                {fields?.map((field, index) => {
                  return (
                    <div className={
                      cn('flex flex-col', active === index ? 'block' : 'hidden')
                    }>
                      <div className='w-full'>
                        <TextAreaForm
                          form={form}
                          label='Description'
                          field={`section.${index}.description`}
                          required
                          rows={10}
                          className='mt-2 w-full'
                        ></TextAreaForm>
                        <div>
                          <InputForm
                            form={form}
                            field={`section.${index}.embedLink`}
                            label='Embed Link'
                            className='m-0 w-full mt-4 mb-2'
                          />
                          <FormDescription>
                            This is embed link for 3D model
                          </FormDescription>
                        </div>
                      </div>
                      <div className='w-full'>
                        <DeepLinkForm
                          name={`section.${index}`}
                          key={index}
                          loading={loading}
                          questions={questions}
                          form={form}
                          index={index}
                        />
                      </div>
                    </div>
                  );
                })}
                {parseStr && <InnerHTML html={parseStr} />}
              </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DeepLink;

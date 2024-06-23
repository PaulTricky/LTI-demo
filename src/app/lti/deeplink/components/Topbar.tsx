'use client';

import {
  Eye,
  LifeBuoy,
  Plus,
  Send,
  SquareUser,
  Trash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Question } from '@/models/question';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import TextAreaForm from '@/components/Form/TextArea';
import SelectForm from '@/components/Form/Select';
import InputForm from '@/components/Form/Input';
import { FormDescription, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function DeepLinkForm({
  form,
  questions,
  loading,
}: {
  form: UseFormReturn<any>;
  questions: any;
  loading: boolean;
}) {
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<any>({
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: 'choices', // unique name for your Field Array
    });

  const multiple = form.watch('multiple');
  const choices = form.watch('choices');

  const errors = form.formState.errors;

  const choicesError =
    (errors?.choices?.root?.message || errors?.choices?.message) as ReactNode;

  return (
    <TooltipProvider>
      <header className='w-full fixed top-0 z-10 justify-between flex h-[53px] items-center gap-1 border-b bg-background px-4'>
        <h1 className='text-xl font-semibold'>Deep Link</h1>
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            type='button'
            size='sm'
            className='gap-1.5 text-sm'
          >
            <Eye className='size-3.5' />
            Preview Question
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
      <div className='grid h-screen w-full pt-[53px] pl-[53px]'>
        <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
          <nav className='grid gap-1 p-2'>
            {questions?.map((question: Question, index: number) => (
              <Tooltip key={question.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-lg bg-muted'
                    aria-label='Playground'
                  >
                    {index + 1}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={5}>
                  {question.question}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <nav className='mt-auto grid gap-1 p-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='mt-auto rounded-lg'
                  aria-label='Help'
                >
                  <LifeBuoy className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='mt-auto rounded-lg'
                  aria-label='Account'
                >
                  <SquareUser className='size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className='flex flex-col'>
          <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
            <div
              className='relative flex-col items-start gap-8'
              x-chunk='dashboard-03-chunk-0'
            >
              <div className='w-full'>
                <TextAreaForm
                  form={form}
                  label='Description'
                  field={'description'}
                  required
                  rows={10}
                  className='mt-2 w-full'
                ></TextAreaForm>
                <div>
                  <InputForm
                    form={form}
                    field={'embedLink'}
                    label='Embed Link'
                    className='m-0 w-full mt-4 mb-2'
                  />
                  <FormDescription>
                    This is embed link for 3D model
                  </FormDescription>
                </div>
              </div>
            </div>
            <div className='max-w-[700px] gap-4 relative flex h-full items-start min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2'>
              <div className='w-full'>
                <TextAreaForm
                  form={form}
                  label='Question'
                  field={'question'}
                  required
                  rows={1}
                  className='mt-2 w-full'
                />
              </div>
              <div className='flex flex-col gap-4 items-start'>
                <Label>Answer</Label>
              </div>
              <Tabs
                value={Number(multiple) ? 'multiple' : 'single'}
                defaultValue='account'
                className='w-auto bg-[#e8e8e8] rounded-md'
                onValueChange={(e) => {
                  console.log('e', e);
                  if (e === 'multiple') {
                    form.setValue('multiple', true, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  } else {
                    form.setValue('multiple', false, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <TabsList className='grid w-full grid-cols-2 bg-[#e8e8e8]'>
                  <TabsTrigger value='single'>Single Choice</TabsTrigger>
                  <TabsTrigger value='multiple'>Multiple Choice</TabsTrigger>
                </TabsList>
              </Tabs>

              {fields?.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className='flex gap-2 items-center w-full'
                  >
                    <div className='mt-2 min-w-[32px] h-[32px] flex items-center justify-center p-2 bg-[#f8afdb] rounded-md mr-2'>
                      {index + 1}
                    </div>
                    <InputForm
                      form={form}
                      field={`choices.${index}.title`}
                      label=''
                      className='m-0 w-full'
                    />
                    <SelectForm
                      form={form}
                      options={[
                        { value: '0', label: 'Incorrect' },
                        { value: '1', label: 'Correct' },
                      ]}
                      field={`choices.${index}.correct`}
                      selectClassName={cn(
                        choices[index]?.correct === '1'
                          ? 'text-white bg-green-600'
                          : ''
                      )}
                      label=''
                    />
                    <Button
                      variant={'default'}
                      onClick={(e) => {
                        remove(index);
                      }}
                      className='bg-[#2d88bc] mt-2 p-1 min-w-[32px] h-[32px]'
                    >
                      <Trash className='w-4 h-4' />
                    </Button>
                  </div>
                );
              })}
              {choicesError && <FormMessage>{choicesError}</FormMessage>}

              <div>
                <Button
                  variant={'ghost'}
                  type='button'
                  className='p-2 h-auto ml-[-8px]'
                  onClick={() => append({ correct: '0' })}
                >
                  <div className='p-2 bg-[#2d88bc] rounded-md mr-2'>
                    <Plus className='w-4 h-4 text-white' />
                  </div>
                  Add Option
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

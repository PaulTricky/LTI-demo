'use client';

import { Eye, LifeBuoy, Plus, Send, SquareUser, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import TextAreaForm from '@/components/Form/TextArea';
import Answer from './Answer';

export function DeepLinkForm({
  form,
  questions,
  loading,
  name,
  index,
}: {
  form: UseFormReturn<any>;
  questions: any;
  name: string;
  loading: boolean;
  index: number;
}) {
  const {
    fields: fieldQuestions,
    append: appendQuestions,
    remove: removeQuestions,
  } = useFieldArray<any>({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: `${name}.questions`, // unique name for your Field Array
  });

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col'>
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2'>
          {fieldQuestions?.map((fieldQuestion, index) => {
            return (
              <div
                data-last={
                  index === fieldQuestions?.length - 1 ? 'true' : 'false'
                }
                className='mx-auto question border max-w-[700px] gap-4 relative flex h-full items-start flex-col rounded-xl p-4 lg:col-span-2'
              >
                <div className='w-full'>
                  <TextAreaForm
                    form={form}
                    field={`${name}.questions.${index}.title`}
                    placeholder={`Question ${index + 1}`}
                    required
                    rows={1}
                    className='mt-2 w-full'
                  />
                </div>
                <Answer removeQuestion={() => removeQuestions(index)} form={form} name={`${name}.questions.${index}`} />
              </div>
            );
          })}
        </main>
      </div>
      <Button
        id={`add-question-${index}`}
        className='hidden'
        type="button"
        onClick={() =>
          appendQuestions({
            multiple: false,
          })
        }
      >
        Add Question
      </Button>
    </div>
  );
}

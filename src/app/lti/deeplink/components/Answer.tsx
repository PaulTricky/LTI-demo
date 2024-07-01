import InputForm from '@/components/Form/Input';
import SelectForm from '@/components/Form/Select';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Plus, Trash } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

const Answer = ({ name, form, removeQuestion }: any) => {
  const { fields, append, remove } =
    useFieldArray<any>({
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: `${name}.choices`, // unique name for your Field Array
    });
  const multiple = form.watch(`${name}.multiple`);
  const choices = form.watch(`${name}.choices`);
  const errors = form.formState.errors;
  const choicesError = (errors?.choices?.root?.message ||
    errors?.choices?.message) as ReactNode;

    useEffect(() => {
      append({ correct: '0' })
      append({ correct: '0' })
      append({ correct: '0' })
      append({ correct: '0' })
    }, [])

  return (
    <div>
      <FormField
          control={form.control}
          name={`${name}.multiple`}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={(e) => {
field.onChange(e === 'true');
                  }}
                  defaultValue={field.value?.toString()}
                  className="flex gap-4 items-center space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={'false'} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Single choice
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={'true'} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Multiple choice
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
      {fields?.map((field, index) => {
        return (
          <div key={field.id} className='border py-2 px-4 rounded-md flex gap-2 items-center w-full'>
            <div className='mt-2 min-w-[32px] h-[32px] flex items-center justify-center p-2 bg-[#f8afdb] rounded-md mr-2'>
              {index + 1}
            </div>
            <InputForm
              form={form}
              field={`${name}.choices.${index}.title`}
              label=''
              className='m-0 w-full'
            />
            <SelectForm
              form={form}
              options={[
                { value: '0', label: 'Incorrect' },
                { value: '1', label: 'Correct' },
              ]}
              field={`${name}.choices.${index}.correct`}
              selectClassName={cn(
                choices[index]?.correct === '1' ? 'text-white bg-green-600' : ''
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
      </div>
      {choicesError && <FormMessage>{choicesError}</FormMessage>}
      <div className="flex mt-4 items-center gap-4">
        <Button
          variant={'ghost'}
          type='button'
          className='text-white p-2 h-auto ml-[-8px] bg-[#2d88bc]'
          onClick={() => append({ correct: '0' })}
        >
          <Plus className='w-4 h-4 mr-2' />
          Add choice
        </Button>
        <Button type='button' onClick={removeQuestion} variant={'destructive'}>Delete Question</Button>
      </div>
    </div>
  );
};

export default Answer;

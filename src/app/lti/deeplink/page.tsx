'use client';

import { DeepLinkForm } from './components/Topbar';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { defaultValues, validationSchema } from './data';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Question } from '@/models/question';
import { useEffect, useState } from 'react';
import { remult } from 'remult';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const questionRepo = remult.repo(Question);
const DeepLink = () => {
  const searchParams = useSearchParams();
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultValues,
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    questionRepo.find().then(setQuestions);
  }, []);

  const sendDeepLinkToLTIAAS = async (resourceid: string) => {
    const ltik = searchParams.get('ltik');
    
    try {
      const res = await axios(`/api/deeplink`, {
        method: 'GET',
        headers: {
          'x_ltik': ltik,
          'x_resourceid': resourceid
        }
      });
      return res.data.data
    } catch(e) {
      console.log("eeeee", e)
      return null;
    }
  }

  const onSubmit = async (values: any) => {
    console.log("submit", values);
    const multipleChoice = values?.multiple;

    setLoading(true);
    
    const correctChoiceLength = values?.choices?.filter((e: any) => e.correct === '1')?.length;

    if (correctChoiceLength < 1) {
      setLoading(false);
      return toast({
        description: 'Please select at least 1 correct choice',
      })
    }

    if (!multipleChoice && correctChoiceLength > 1) {
      setLoading(false);
      return toast({
        description: 'Please select 1 correct for single choice',
      })
    }

    const model: Omit<Question, 'id'> = {
      question: values?.question,
      description: values.description,
      embedLink: values?.embedLink,
      choices: values?.choices,
      multiple: values?.multiple
    };

    console.log("model", model);

    const data = await questionRepo.save(model);

    const formData = await sendDeepLinkToLTIAAS(data.id);

    console.log("formData", formData)

    if (formData?.form || formData?.form) {
      document.querySelector("body")?.append(formData?.form);
    }

    setLoading(false);
    form.reset();

    
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex gap-4 flex-col'
        >
          <DeepLinkForm loading={loading} questions={questions} form={form} />

        </form>
      </Form>
    </div>
  );
};

export default DeepLink;

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
import InnerHTML from 'dangerously-set-html-content'

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
  const [parseStr, setParseStr] = useState('');

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

  const createLineItem = async (title: string, resourceId: string, resourceLinkId: string) => {
    const ltik = searchParams.get('ltik');
    
    try {
      const res = await axios(`/api/lineItem`, {
        method: 'POST',
        headers: {
          'x_ltik': ltik,
        },
        data: {
          label: title, 
          scoreMaximum: 100, 
          resourceId,
          tag: "grade", 
          resourceLinkId, 
          gradesReleased: true 
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

    const data = await questionRepo.save(model);

    const formData = await sendDeepLinkToLTIAAS(data.id);
    const resourceLinkId = `/lti/launch?resourceid=${data.id}`;
    const resourceId = data.id;
    const item = await createLineItem(values?.title, resourceId, resourceLinkId);
    console.log("item", item);
    
    if (formData?.form) {
      setTimeout(() => {
        alert(1);
        setParseStr(formData?.form)
      }, 10000);
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
          {parseStr && <InnerHTML html={parseStr} /> }
        </form>
      </Form>
    </div>
  );
};

export default DeepLink;

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

    if (formData?.form) {
      setParseStr(formData?.form)
    }


    setLoading(false);
    form.reset();

    
  };
// 
  // useEffect(() => {
    // setTimeout(() => {
      // setParseStr('<form id="ltiaas_dl" style="display: none;" action="https://sandbox.openedx.org/api/lti_consumer/v1/lti/20/lti-dl/response" method="POST">\n                  <input type="hidden" name="JWT" value="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJaSFFTa3NnNGRtU3FHZ1VvOWx0In0.eyJpc3MiOiIwNTViMmI5Ni0wNTgzLTQxNjktYjY0Mi0yMzNiYzFlMzIyOTAiLCJhdWQiOiJodHRwczovL3NhbmRib3gub3BlbmVkeC5vcmciLCJub25jZSI6InVlUXRVcWE5M3l4QTlNM3JXNlZ0aWJHaEZpSEQ1SXE2IiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vZGVwbG95bWVudF9pZCI6IjEiLCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9tZXNzYWdlX3R5cGUiOiJMdGlEZWVwTGlua2luZ1Jlc3BvbnNlIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vdmVyc2lvbiI6IjEuMy4wIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGktZGwvY2xhaW0vbXNnIjoiRGVlcCBMaW5raW5nIHN1Y2Nlc3NmdWwhIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGktZGwvY2xhaW0vbG9nIjoiZGVlcF9saW5raW5nX3N1Y2Nlc3NmdWwiLCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS1kbC9jbGFpbS9jb250ZW50X2l0ZW1zIjpbeyJ0eXBlIjoibHRpUmVzb3VyY2VMaW5rIiwidXJsIjoiaHR0cHM6Ly9sdGktZ2FtZS5sdGlhYXMuY29tL2x0aS9sYXVuY2g_cmVzb3VyY2VpZD1pM3c1bDI2bXN3anM1Yjd4ejdvencxNXgiLCJ0aXRsZSI6IlJlc291cmNlIn1dLCJpYXQiOjE3MTkxNjU4MzUsImV4cCI6MTcxOTE2NjQzNX0.gzuqqXFVyEsHdR6pZ6ejZzfhcwNqINBgqeSmRYn9muClcUMNptQGTNzxzRS-o_uu6hTkZQE6BoaHGdtkIoBqHsQGuRIEByQICtBRIPe_7Eq-O_k2lOLX-HN0Lyf5YC6zPFE0XeZnHfqICkC9Qd05n2Zi2fJxH8Rd_bhtKc00-pg34DsBCO3YDS1dP_QPSDt2qH72pnD_yfuR56v7KCkMHcsFT0EeH2OnEIA8bo7JTTcfNKmGhIvi_PIWf36RB8pT5anxogeUzNurWQfrL9Socct8UKaxNrtxHlGGsmViZp445By5H7Kr0PGhd-L8jse4LUw74xmy509sr1ilJDdmBg" />\n                </form>\n                \x3Cscript>\n            document.getElementById("ltiaas_dl").submit()\n                \x3C/script>')
    // }, 3000)
  // }, [])

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
